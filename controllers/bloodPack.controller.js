
const packService = require ("../services/BloodPack.service.js");
const hospitalservice = require("../services/hospital.service.js");
const userService = require("../services/user.service.js");
const axios = require('axios')
const predictionService = require('../services/prediction.service.js');

const volumeStandards = {
     RBC: { volume: 275 },        
    PLT: { volume: 60 },       
    PL: { volume: 225 },           
    Cryoprecipitate: { volume: 15 },
    Whole: { volume: 475 },
};

const createPack = async (req, res) => {
    const { pack, donor } = req.body;
    const { id } = req.params;
    let donorId,donorGroup,hospitalPrice;
    try {
        const hospitalExists = await hospitalservice.getHospitalById(id);
        if (!hospitalExists) {
            return res.status(404).json({ message: "Hospital not found" });
        }else{
            console.log("Existing hospital:", hospitalExists);  
            hospitalPrice = hospitalExists.packPrice;
        }
        const packExists = await packService.getPacksById(pack?.id);
        if (packExists) {
            return res.status(400).json({ message: "Blood pack already exists!" });
        }
        const existingDonor = await userService.getUserByEmail(donor?.email);
        if (existingDonor) {
            console.log("Existing Donor:", existingDonor);  
            donorId = existingDonor._id;
            donorGroup = existingDonor.bloodGroup;
        } else {
            const newDonor = await userService.registerUser(donor);
            console.log("New Donor:", newDonor); 
            donorId = newDonor._id;
            donorGroup = newDonor.bloodGroup;
        }
        console.log(donorGroup);
        const newPack = { ...pack, donor: donorId,hospital:id,group:donorGroup,price:hospitalPrice };
        const addedPack = await packService.createPack(newPack);
        const savedPack = await addedPack.save();
      
        return res.status(200).json({ message: "New blood pack added successfully!", data: savedPack });
    } catch (error) {
        console.error("Error creating the pack: ", error);
        return res.status(500).json({ message: "Failed to create blood pack", error: error.message });
    }
};

// const checkDonor = async (req, res) => {
//     const { donorId } = req.body;

//     try {
//         const bloodPacks = await packService.getBloodPacksByDonorId(donorId);

//          if (!bloodPacks || bloodPacks.length === 0) {
//             return res.status(200).json({ 
//                 status: 'new_donor',
//                 isSafeToDonate: true,
//                 recommendation: 'No donation history found'
//             });
//         }

//         let totalVolumeDonated = 0;
//         let numberOfDonations = bloodPacks.length;
//         let firstDonationDate = null;
//         let lastDonationDate = null;

//         bloodPacks.forEach(pack => {
//             const components = pack.components.split(/[,/]/);
//             components.forEach(component => {
//                 if (volumeStandards[component]) {
//                     totalVolumeDonated += volumeStandards[component].volume;
//                 }
//             });

//             const collectionDate = new Date(pack.CollectionDate);

//             if (!firstDonationDate || collectionDate < firstDonationDate) {
//                 firstDonationDate = collectionDate;
//             }

//             if (!lastDonationDate || collectionDate > lastDonationDate) {
//                 lastDonationDate = collectionDate;
//             }
//         });

//         const currentDate = new Date();

//         const monthsSinceFirstDonation =
//             (currentDate.getFullYear() - firstDonationDate.getFullYear()) * 12 +
//             (currentDate.getMonth() - firstDonationDate.getMonth());

//         const monthsSinceLastDonation =
//             (currentDate.getFullYear() - lastDonationDate.getFullYear()) * 12 +
//             (currentDate.getMonth() - lastDonationDate.getMonth());

//         // const aiResult = aiResponse.data;

//         const predictionData = {
//             "Months since Last Donation": monthsSinceLastDonation,
//             "Number of Donations": numberOfDonations,
//             "Total Volume Donated (c.c.)": totalVolumeDonated,
//             "Months since First Donation": monthsSinceFirstDonation
//         };
//         // Get prediction from your Flask API
//         const aiResponse = await axios.post('http://127.0.0.1:5000/predict', predictionData);
//         const { prediction, probability, decision_reason, metrics } = aiResponse.data;
//          // Safely handle decision factors
//         const decisionFactors = decision_reason.factors || [];
//         const defaultReasons = prediction === 1 
//             ? ['Meets basic donation criteria'] 
//             : ['Does not meet donation criteria'];
//         // Prepare response
//         return res.status(200).json({
//             donorId,
//             status: prediction === 1 ? 'safe' : 'unsafe',
//             confidence: Math.round(probability * 100),
//             decisionFactors: decisionFactors.length ? decisionFactors : defaultReasons,
//             donationMetrics: {
//                 totalDonations: bloodPacks.length,
//                 totalVolumeDonated,
//                 donationRate: metrics.donation_rate_per_month,
//                 averageVolume: metrics.average_volume_per_donation,
//                 lastDonationMonthsAgo: monthsSinceLastDonation
//             },
//             meetsBasicRequirement: monthsSinceLastDonation >= 3, 
//             recommendation: prediction === 1 
//                 ? 'Safe to donate based on donation history' 
//                 : `Not recommended: `
//         });

//     } catch (error) {
//         console.error("Error checking donor:", error.message);
//         return res.status(500).json({
//             message: 'An error occurred while checking donor',
//             error: error.message
//         });
//     }
// };

// const checkDonor = async (req, res) => {
//     const { donorId } = req.body;

//     // Debug logging to check what's being passed
//     console.log("=== DONOR CHECK DEBUG ===");
//     console.log("Request body:", req.body);
//     console.log("Extracted donorId:", donorId);
//     console.log("donorId type:", typeof donorId);
//     console.log("donorId value:", JSON.stringify(donorId));

//     // Validate donorId
//     if (!donorId) {
//         console.log("ERROR: donorId is missing or falsy");
//         return res.status(400).json({ 
//             error: 'donorId is required',
//             receivedBody: req.body 
//         });
//     }

//     try {
//         // Debug the service call
//         console.log("Calling packService.getBloodPacksByDonorId with:", donorId);
//         const bloodPacks = await packService.getBloodPacksByDonorId(donorId);
        
//         // Debug the results
//         console.log("Blood packs found:", bloodPacks?.length || 0);
//         console.log("Blood packs data:", JSON.stringify(bloodPacks, null, 2));

//         // Check if bloodPacks is actually an array
//         if (!Array.isArray(bloodPacks)) {
//             console.log("WARNING: bloodPacks is not an array:", typeof bloodPacks);
//             console.log("bloodPacks content:", bloodPacks);
//         }

//         if (!bloodPacks || bloodPacks.length === 0) {
//             console.log("No blood packs found for donorId:", donorId);
//             return res.status(200).json({ 
//                 status: 'new_donor',
//                 isSafeToDonate: true,
//                 confidence: 100,
//                 decisionFactors: ['No donation history found'],
//                 donationMetrics: {
//                     totalDonations: 0,
//                     totalVolumeDonated: 0,
//                     donationRate: 0,
//                     averageVolume: 0,
//                     lastDonationMonthsAgo: 0
//                 },
//                 meetsBasicRequirement: true,
//                 recommendation: 'No donation history found. Eligible for first-time donation if other requirements are met.',
//                 debug: {
//                     donorId: donorId,
//                     bloodPacksFound: 0,
//                     bloodPacksType: typeof bloodPacks
//                 }
//             });
//         }

//         // Debug each blood pack
//         bloodPacks.forEach((pack, index) => {
//             console.log(`Blood pack ${index + 1}:`, {
//                 id: pack.id,
//                 donorId: pack.donor, 
//                 collectionDate: pack.CollectionDate || pack.CollectionDate,
//                 components: pack.components
//             });
//         });

//         // Handle single donation case - skip AI prediction
//         if (bloodPacks.length === 1) {
//             console.log("Single donation case detected");
//             let totalVolumeDonated = 0;
//             const pack = bloodPacks[0];
            
//             // Debug the pack components
//             console.log("Pack components:", pack.components);
            
//             // Calculate volume from components (e.g., "RBC/PLT/PL")
//             const components = pack.components.split(/[,/]/);
//             console.log("Split components:", components);
            
//             components.forEach(component => {
//                 const trimmedComponent = component.trim();
//                 console.log(`Checking component: "${trimmedComponent}"`);
//                 if (volumeStandards[trimmedComponent]) {
//                     console.log(`Found volume standard: ${volumeStandards[trimmedComponent].volume}`);
//                     totalVolumeDonated += volumeStandards[trimmedComponent].volume;
//                 } else {
//                     console.log(`No volume standard found for: "${trimmedComponent}"`);
//                 }
//             });

//             const collectionDate = new Date(pack.CollectionDate);
//             const currentDate = new Date();
//             const monthsSinceLastDonation =
//                 (currentDate.getFullYear() - collectionDate.getFullYear()) * 12 +
//                 (currentDate.getMonth() - collectionDate.getMonth());

//             console.log("Collection date:", collectionDate);
//             console.log("Current date:", currentDate);
//             console.log("Months since last donation:", monthsSinceLastDonation);

//             // Determine if it's safe based on time since last donation
//             const isSafe = monthsSinceLastDonation >= 3;
//             const decisionFactors = isSafe 
//                 ? ['Single donation history', `${monthsSinceLastDonation} months since last donation (≥3 months required)`]
//                 : ['Single donation history', `Only ${monthsSinceLastDonation} months since last donation (<3 months required)`];

//             return res.status(200).json({
//                 donorId,
//                 status: isSafe ? 'safe' : 'unsafe',
//                 isSafeToDonate: isSafe,
//                 confidence: 90,
//                 decisionFactors,
//                 donationMetrics: {
//                     totalDonations: 1,
//                     totalVolumeDonated,
//                     donationRate: 0, // Cannot calculate rate with single donation
//                     averageVolume: totalVolumeDonated,
//                     lastDonationMonthsAgo: monthsSinceLastDonation
//                 },
//                 meetsBasicRequirement: monthsSinceLastDonation >= 3,
//                 recommendation: isSafe 
//                     ? 'Safe to donate. Single donation history with adequate recovery time.' 
//                     : `Not recommended. Need to wait ${3 - monthsSinceLastDonation} more months before next donation.`,
//                 debug: {
//                     donorId: donorId,
//                     bloodPacksFound: 1,
//                     totalVolumeDonated: totalVolumeDonated,
//                     components: components
//                 }
//             });
//         }

//         // Multiple donations case
//         console.log(`Multiple donations case: ${bloodPacks.length} donations`);
        
//         let totalVolumeDonated = 0;
//         let numberOfDonations = bloodPacks.length;
//         let firstDonationDate = null;
//         let lastDonationDate = null;

//         bloodPacks.forEach((pack, index) => {
//             console.log(`Processing pack ${index + 1}:`, pack);
            
//             const components = pack.components.split(/[,/]/);
//             components.forEach(component => {
//                 const trimmedComponent = component.trim();
//                 if (volumeStandards[trimmedComponent]) {
//                     totalVolumeDonated += volumeStandards[trimmedComponent].volume;
//                 }
//             });

//             const collectionDate = new Date(pack.CollectionDate);
//             console.log(`Pack ${index + 1} collection date:`, collectionDate);

//             if (!firstDonationDate || collectionDate < firstDonationDate) {
//                 firstDonationDate = collectionDate;
//             }

//             if (!lastDonationDate || collectionDate > lastDonationDate) {
//                 lastDonationDate = collectionDate;
//             }
//         });

//         console.log("First donation date:", firstDonationDate);
//         console.log("Last donation date:", lastDonationDate);
//         console.log("Total volume donated:", totalVolumeDonated);

//         const currentDate = new Date();

//         const monthsSinceFirstDonation =
//             (currentDate.getFullYear() - firstDonationDate.getFullYear()) * 12 +
//             (currentDate.getMonth() - firstDonationDate.getMonth());

//         const monthsSinceLastDonation =
//             (currentDate.getFullYear() - lastDonationDate.getFullYear()) * 12 +
//             (currentDate.getMonth() - lastDonationDate.getMonth());

//         console.log("Months since first donation:", monthsSinceFirstDonation);
//         console.log("Months since last donation:", monthsSinceLastDonation);

//         // Handle case where months since first donation is 0 (recent donor)
//         if (monthsSinceFirstDonation === 0) {
//             console.log("Recent donor case (monthsSinceFirstDonation === 0)");
//             const isSafe = monthsSinceLastDonation >= 3;
//             const decisionFactors = isSafe 
//                 ? [`Recent donor with ${numberOfDonations} donation(s)`, `${monthsSinceLastDonation} months since last donation (≥3 months required)`]
//                 : [`Recent donor with ${numberOfDonations} donation(s)`, `Only ${monthsSinceLastDonation} months since last donation (<3 months required)`];

//             return res.status(200).json({
//                 donorId,
//                 status: isSafe ? 'safe' : 'unsafe',
//                 isSafeToDonate: isSafe,
//                 confidence: 85,
//                 decisionFactors,
//                 donationMetrics: {
//                     totalDonations: numberOfDonations,
//                     totalVolumeDonated,
//                     donationRate: 0, // Cannot calculate rate when months since first donation is 0
//                     averageVolume: totalVolumeDonated / numberOfDonations,
//                     lastDonationMonthsAgo: monthsSinceLastDonation
//                 },
//                 meetsBasicRequirement: monthsSinceLastDonation >= 3,
//                 recommendation: isSafe 
//                     ? 'Safe to donate. Recent donor with adequate recovery time.' 
//                     : `Not recommended. Need to wait ${3 - monthsSinceLastDonation} more months before next donation.`,
//                 debug: {
//                     donorId: donorId,
//                     bloodPacksFound: numberOfDonations,
//                     monthsSinceFirstDonation: monthsSinceFirstDonation,
//                     monthsSinceLastDonation: monthsSinceLastDonation
//                 }
//             });
//         }

//         // AI prediction case
//         console.log("Proceeding with AI prediction");
        
//         const predictionData = {
//             "Months since Last Donation": monthsSinceLastDonation,
//             "Number of Donations": numberOfDonations,
//             "Total Volume Donated (c.c.)": totalVolumeDonated,
//             "Months since First Donation": monthsSinceFirstDonation
//         };

//         console.log("Prediction data:", predictionData);

//         // Get prediction from your Flask API
//         const aiResponse = await axios.post('http://127.0.0.1:5000/predict', predictionData);
//         const { prediction, probability, decision_reason, metrics } = aiResponse.data;

//         console.log("AI Response:", aiResponse.data);

//         // const decisionFactors = decision_reason?.factors || [];
//         const meetsBasicRequirement = monthsSinceLastDonation >= 3;
//         let finalDecisionFactors = [];
//         if (decision_reason && Array.isArray(decision_reason.factors)) {
//             finalDecisionFactors = [...decision_reason.factors];
//         }
//         if (decision_reason && decision_reason.confidence_level) {
//             finalDecisionFactors.push(`Confidence level: ${decision_reason.confidence_level}`);
//         }
//         // Fallback if no specific factors are provided
//         if (finalDecisionFactors.length === 0) {
//             finalDecisionFactors.push(prediction === 1 ? 'Meets basic donation criteria' : 'Does not meet donation criteria');
//         }
//         const status = prediction === 1 ? 'safe' : 'unsafe';
//         const recommendation = prediction === 1
//             ? 'Safe to donate based on AI analysis of donation history.'
//             : 'Not recommended based on AI analysis of donation history.';
//         // Prepare response
//             if (!meetsBasicRequirement) {
//                 console.log("Donor does NOT meet basic 3-month deferral requirement.");
//                 return res.status(200).json({
//                     donorId,
//                     status: 'unsafe', // Explicitly unsafe due to rule
//                     isSafeToDonate: false,
//                     confidence: 100, // Very high confidence in this rule-based decision
//                     decisionFactors: [`**CRITICAL**: Last donation was only ${monthsSinceLastDonation} month(s) ago. Must wait at least 3 months.`],
//                     donationMetrics: {
//                         totalDonations: numberOfDonations,
//                         totalVolumeDonated: totalVolumeDonated,
//                         donationRate: numberOfDonations / (monthsSinceFirstDonation || 1),
//                         averageVolume: totalVolumeDonated / (numberOfDonations || 1),
//                         lastDonationMonthsAgo: monthsSinceLastDonation,
//                         monthsSinceFirstDonation: monthsSinceFirstDonation
//                     },
//                     meetsBasicRequirement: false,
//                     recommendation: `Not recommended: Donor must wait ${3 - monthsSinceLastDonation} more month(s) since last donation.`,
//                     debug: {
//                         donorId: donorId,
//                         bloodPacksFound: numberOfDonations,
//                         reason: "Failed hard medical deferral rule."
//                     }
//                     });
//              }

//     } catch (error) {
//         console.error("Error checking donor:", error.message);
//         console.error("Error stack:", error.stack);
//         return res.status(500).json({
//             message: 'An error occurred while checking donor',
//             error: error.message,
//             debug: {
//                 donorId: donorId,
//                 errorType: error.constructor.name
//             }
//         });
//     }
// };
    
const checkDonor = async (req, res) => {
    const { donorId } = req.body;

    if (!donorId) {
        console.error("ERROR: donorId is missing or falsy in request body.");
        // It's good practice to return here if validation fails at the start
        return res.status(400).json({ error: "Donor ID is required." });
    }

    let predictionResult; // Declare predictionResult outside the try block for broader scope

    try {
        const bloodPacks = await packService.getBloodPacksByDonorId(donorId);

        if (bloodPacks.length === 0) {
            console.log(`No blood packs found for donorId: ${donorId}. Treating as new donor.`);
            predictionResult = { // Assign to predictionResult
                donorId,
                status: 'new_donor',
                isSafeToDonate: true,
                confidence: 100,
                decisionFactors: ['No prior donation history found. Eligible for first-time donation if other criteria are met during screening.'],
                donationMetrics: {
                    totalDonations: 0,
                    totalVolumeDonated: 0,
                    donationRate: 0,
                    averageVolume: 0,
                    lastDonationMonthsAgo: 0,
                    monthsSinceFirstDonation: 0
                },
                meetsBasicRequirement: true,
                recommendation: 'New donor: Eligible for first-time donation (pending full medical screening).',
                debug: { donorId, bloodPacksFound: 0 }
            };
            // Do not return here, continue to save
        } else { // All existing logic goes into this else block to compute predictionResult
            let totalVolumeDonated = 0;
            const numberOfDonations = bloodPacks.length;
            let firstDonationDate = null;
            let lastDonationDate = null;
            const currentDate = new Date();

            bloodPacks.forEach(pack => {
                const components = (pack.components || '').split(/[,/]/);
                components.forEach(component => {
                    const trimmedComponent = component.trim();
                    if (volumeStandards[trimmedComponent]) {
                        totalVolumeDonated += volumeStandards[trimmedComponent].volume;
                    } else {
                        console.warn(`No volume standard found for component: "${trimmedComponent}" in pack ID: ${pack.id}`);
                    }
                });

                const collectionDate = new Date(pack.CollectionDate);
                if (isNaN(collectionDate.getTime())) {
                    console.error(`Invalid CollectionDate for pack ID: ${pack.id}, Value: ${pack.CollectionDate}`);
                    return;
                }

                if (!firstDonationDate || collectionDate < firstDonationDate) {
                    firstDonationDate = collectionDate;
                }
                if (!lastDonationDate || collectionDate > lastDonationDate) {
                    lastDonationDate = collectionDate;
                }
            });


            if (!firstDonationDate || !lastDonationDate) {
                console.error(`Error: Could not determine valid first or last donation date for donorId: ${donorId}.`);
                // Set predictionResult for a failure case before saving
                predictionResult = {
                    donorId,
                    status: 'error',
                    isSafeToDonate: false,
                    confidence: 0,
                    decisionFactors: ["Failed to process donor's donation history due to invalid dates."],
                    donationMetrics: { /* empty or default metrics */ },
                    meetsBasicRequirement: false,
                    recommendation: "Data processing error.",
                    debug: { donorId, error: "Invalid donation dates" }
                };
                // Do not return here, continue to save
            } else { // Continue with calculations and AI call if dates are valid
                const monthsSinceFirstDonation =
                    (currentDate.getFullYear() - firstDonationDate.getFullYear()) * 12 +
                    (currentDate.getMonth() - firstDonationDate.getMonth());

                const monthsSinceLastDonation =
                    (currentDate.getFullYear() - lastDonationDate.getFullYear()) * 12 +
                    (currentDate.getMonth() - lastDonationDate.getMonth());

                const totalMonthsSinceFirstDonation = Math.max(0, (currentDate.getFullYear() - firstDonationDate.getFullYear()) * 12 + (currentDate.getMonth() - firstDonationDate.getMonth()));
                const totalMonthsSinceLastDonation = Math.max(0, (currentDate.getFullYear() - lastDonationDate.getFullYear()) * 12 + (currentDate.getMonth() - lastDonationDate.getMonth()));

                const meetsBasicRequirement = totalMonthsSinceLastDonation >= 3;

                if (!meetsBasicRequirement) {
                    console.log(`Donor ${donorId} does NOT meet basic 3-month deferral requirement (last donation: ${totalMonthsSinceLastDonation} months ago).`);
                    predictionResult = { // Assign to predictionResult
                        donorId,
                        status: 'unsafe',
                        isSafeToDonate: false,
                        confidence: 100,
                        decisionFactors: [`**CRITICAL**: Last donation was only ${totalMonthsSinceLastDonation} month(s) ago. Donor must wait at least 3 months.`],
                        donationMetrics: {
                            totalDonations: numberOfDonations,
                            totalVolumeDonated: totalVolumeDonated,
                            donationRate: numberOfDonations / (totalMonthsSinceFirstDonation || 1),
                            averageVolume: totalVolumeDonated / (numberOfDonations || 1),
                            lastDonationMonthsAgo: totalMonthsSinceLastDonation,
                            monthsSinceFirstDonation: totalMonthsSinceFirstDonation
                        },
                        meetsBasicRequirement: false,
                        recommendation: `Not recommended: Donor must wait ${3 - totalMonthsSinceLastDonation} more month(s) before next donation.`,
                        debug: { donorId, reason: "Failed hard medical deferral rule." }
                    };
                    // Do not return here, continue to save
                } else if (numberOfDonations === 1 || totalMonthsSinceFirstDonation <= 1) {
                    console.log(`Bypassing AI for donor ${donorId}: Single donation (${numberOfDonations}) or very recent first donor (${totalMonthsSinceFirstDonation} months since first donation) - after meeting 3-month deferral.`);
                    const status = 'safe';
                    const recommendation = 'Safe to donate based on basic criteria (recovery time met).';
                    let decisionFactors = [`${numberOfDonations} donation(s) found.`, `${totalMonthsSinceLastDonation} months since last donation.`];
                    if (totalMonthsSinceFirstDonation <= 1) {
                        decisionFactors.push("Very recent first donation, AI prediction might not be applicable yet.");
                    }

                    predictionResult = { // Assign to predictionResult
                        donorId,
                        status: status,
                        isSafeToDonate: true,
                        confidence: 85,
                        decisionFactors: decisionFactors,
                        donationMetrics: {
                            totalDonations: numberOfDonations,
                            totalVolumeDonated: totalVolumeDonated,
                            donationRate: numberOfDonations / (totalMonthsSinceFirstDonation || 1),
                            averageVolume: totalVolumeDonated / (numberOfDonations || 1),
                            lastDonationMonthsAgo: totalMonthsSinceLastDonation,
                            monthsSinceFirstDonation: totalMonthsSinceFirstDonation
                        },
                        meetsBasicRequirement: true,
                        recommendation: recommendation,
                        debug: { donorId, reason: "Bypassed AI due to single/recent donation logic (and passed 3-month deferral)." }
                    };
                    // Do not return here, continue to save
                } else {
                    console.log(`Proceeding with AI prediction for donorId: ${donorId}.`);

                    const predictionData = {
                        "Months since Last Donation": totalMonthsSinceLastDonation,
                        "Number of Donations": numberOfDonations,
                        "Total Volume Donated (c.c.)": totalVolumeDonated,
                        "Months since First Donation": totalMonthsSinceFirstDonation
                    };

                    let aiResponse;
                    try {
                        aiResponse = await axios.post('http://127.0.0.1:5000/predict', predictionData);
                    } catch (axiosError) {
                        console.error(`Error calling AI service for donorId ${donorId}:`, axiosError.message);
                        let errorMessage = "Failed to get AI prediction.";
                        if (axiosError.response) {
                            console.error("AI service error response:", axiosError.response.data);
                        }
                        // Set predictionResult for AI failure
                        predictionResult = {
                            donorId,
                            status: 'error',
                            isSafeToDonate: false,
                            confidence: 0,
                            decisionFactors: [errorMessage, axiosError.message],
                            donationMetrics: { /* empty or default metrics */ },
                            meetsBasicRequirement: false,
                            recommendation: "AI prediction failed.",
                            debug: { donorId, error: 'AI_Service_Call_Failed', details: axiosError.message }
                        };
                        // Do not return here, continue to save
                        // If you *must* return early on AI failure, move this block and the return statement up.
                    }

                    // Only proceed if aiResponse was successful (or if we set predictionResult for failure above)
                    if (aiResponse) { // Check if aiResponse exists before accessing its data
                        const { prediction, probability, confidence, decision_reason, metrics } = aiResponse.data;

                        let finalDecisionFactors = [];
                        if (decision_reason && Array.isArray(decision_reason.factors)) {
                            finalDecisionFactors = [...decision_reason.factors];
                        }
                        if (decision_reason && decision_reason.confidence_level) {
                            finalDecisionFactors.push(`Confidence level: ${decision_reason.confidence_level}`);
                        }
                        if (finalDecisionFactors.length === 0) {
                            finalDecisionFactors.push(prediction === 1 ? 'Meets donation criteria based on AI analysis.' : 'Does not meet donation criteria based on AI analysis.');
                        }

                        const status = prediction === 1 ? 'safe' : 'unsafe';
                        const recommendation = prediction === 1
                            ? 'Safe to donate based on AI analysis of donation history.'
                            : 'Not recommended based on AI analysis of donation history.';

                        predictionResult = { // Assign to predictionResult
                            donorId,
                            status: status,
                            isSafeToDonate: prediction === 1,
                            confidence: Math.round(confidence * 1000) / 10,
                            decisionFactors: finalDecisionFactors,
                            donationMetrics: {
                                totalDonations: numberOfDonations,
                                totalVolumeDonated: totalVolumeDonated,
                                donationRate: metrics?.donation_rate_per_month !== undefined ? metrics.donation_rate_per_month : (numberOfDonations / (totalMonthsSinceFirstDonation || 1)),
                                averageVolume: metrics?.average_volume_per_donation !== undefined ? metrics.average_volume_per_donation : (totalVolumeDonated / (numberOfDonations || 1)),
                                lastDonationMonthsAgo: totalMonthsSinceLastDonation,
                                monthsSinceFirstDonation: totalMonthsSinceFirstDonation
                            },
                            meetsBasicRequirement: true,
                            recommendation: recommendation,
                            debug: {
                                donorId: donorId,
                                bloodPacksFound: numberOfDonations,
                                predictionData: predictionData,
                                aiPrediction: prediction,
                                aiProbability: probability,
                                aiConfidence: confidence,
                                aiDecisionReason: decision_reason
                            }
                        };
                        // Do not return here, continue to save
                    }
                }
            }
        }

        // --- ADDED: Save the prediction using the service function ---
        if (predictionResult) { // Ensure predictionResult was set
            try {
                const savedPrediction = await predictionService.createPrediction(predictionResult);
                console.log(`Prediction for donor ${donorId} saved successfully with ID: ${savedPrediction._id}`);
                // Optionally add a save status to the result for the client
                predictionResult.save_status = 'success';
            } catch (saveError) {
                console.error(`WARNING: Failed to save prediction for donor ${donorId}:`, saveError.message);
                predictionResult.save_status = 'failed';
                predictionResult.save_error_message = saveError.message;
            }
        } else {
             // This case should ideally not happen if all paths set predictionResult
             console.error(`ERROR: predictionResult was not set for donor ${donorId} before saving attempt.`);
             predictionResult = {
                donorId,
                status: 'error',
                isSafeToDonate: false,
                confidence: 0,
                decisionFactors: ["Internal error: Prediction result not generated."],
                recommendation: "Internal error."
             };
             predictionResult.save_status = 'failed';
             predictionResult.save_error_message = "Prediction result was null/undefined.";
        }
        // --- END ADDED ---

        // Final response now uses the predictionResult that was computed and potentially saved
        return res.status(200).json(predictionResult);

    } catch (error) {
        console.error(`Critical error in checkDonor function for donorId ${donorId}:`, error.message);
        console.error("Error stack:", error.stack);

        // If an error occurred before predictionResult could be definitively set, handle it here.
        // Otherwise, if predictionResult was partially set before a save error, it would be caught above.
        let errorMessage = 'An unexpected error occurred while processing donor information. Please check logs.';
        let errorType = error.constructor.name;
        let statusCode = 500;

        // Custom error handling for service-level errors that bubbled up
        if (error.message.includes("Failed to retrieve blood packs")) { // Example if packService throws
            statusCode = 500;
            errorMessage = "Failed to retrieve donor's blood pack history.";
            errorType = "Pack_Service_Error";
        }

        return res.status(statusCode).json({
            message: errorMessage,
            error: error.message,
            debug: {
                donorId: donorId,
                errorType: errorType,
                originalErrorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        });
    }
};



const getAllPacks = async (req, res) => {
    try {
        console.log("dmk")
        const packs = await packService.getAllPacks();
        return res.status(200).json({message: "all packs fetched Successfully", data:packs})

    } catch(error) {
        console.error(error)
    }
}

const getAllPacksByGroup = async (req, res) => {
    try {
        const group = req.body;
        const packs = await packService.getPackByGroup(group);
        return res.status(200).json({message: "pack Successfully fetched", data:packs})

    } catch(error) {
        console.log(error)
    }
}
const getPacksById= async (req, res) => {
    try {
        const pack = await packService.getPacksById(req.params?.id); 
    
        if (!pack) {
            return res.status(404).json({ data: null, message: 'blood pack not found' });
        }
        return res.status(200).json({ data: pack, message: 'pack fetched successfully!' });
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ data: null, message: 'An error occurred while fetching pack' });
    }
};
const getPacksByHospitalId = async (req, res) => {
    const hospitalId = req.params.id; 
  
    try {
        const packs = await packService.getPacksByHospitalId(hospitalId);
        const aggregatedData = await packService.aggregatePacksByHospital(hospitalId);

        if (packs.length === 0) {
            return res.status(404).json({ message: 'No blood packs found for this hospital' });
        }
        
        console.log('Hospital ID:', hospitalId);
        console.log('Packs:', packs);
        console.log('Aggregated Data Length:', aggregatedData.length);
       

        return res.status(200).json({
            message: 'Packs fetched successfully!',
            data: packs,  
            aggregation: aggregatedData  
        });
    } catch (err) {
        console.log("Error fetching packs:", err);
        return res.status(500).json({ message: 'An error occurred while fetching packs', error: err.message });
    }
};

const DeletePacks = async(req, res) =>{
    const {id} = req.body;
    try {
        const pack = await packService.DeletePack(id);
        return res.status(200).json({message: `${pack} deleted successfully`, data:pack})
    } catch(error) {
        console.error(error)
    }
}

const updatePacks = async (req, res) => {
    const {id, pack} = req.body;
    try {
        const packs = await packService.updatePack(id, pack);
        return res.status(200).json({message:  "updated successfully", data:packs})
    } catch(error) {
        console.error(error)
    }
}
module.exports={
    updatePacks,
    DeletePacks,
    getAllPacks,
    getAllPacksByGroup,
    createPack,
    getPacksById,
    getPacksByHospitalId,
    checkDonor,
}




