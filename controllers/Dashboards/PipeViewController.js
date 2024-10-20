import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
class PipeViewController {
  static getPipeView = catchAsyncError(async (req, res, next) => {
    console.log("pipe view")
    const { particularDate } = req.body; // Expected to be a timestamp
    if (!particularDate) throw new Error("Particular date is required.");
    const targetDate = new Date(particularDate);

    // Define the stages for response
    const pipeView = {
      lead: [],
      prospect: [],
      qualification: [],
      proposal: [],
      followup: [],
      closing: []
    };

    // Query the StageHistoryModel for opportunities active on the given date
    const opportunitiesInStages = await StageHistoryModel.aggregate([
      {
        $match: {
          $and: [
            { entryDate: { $lte: targetDate } }, // Entered the stage on or before the target date
            {
              $or: [
                { exitDate: { $gt: targetDate } }, // Hasn't exited yet or exited after the target date
                { exitDate: { $eq: null } }        // Still in the stage (exitDate is null)
              ]
            }
          ]
        }
      },
      {
        $lookup: {
          from: "opportunitymasters", // Assuming the collection name is 'opportunitymastermodels'
          localField: "opportunity",
          foreignField: "_id",
          as: "opportunityDetails"
        }
      },
      { $unwind: "$opportunityDetails" }, // Deconstruct the opportunityDetails array
      {
        $lookup: {
          from: "salesstages", // Assuming the collection name is 'salesstagemodels'
          localField: "stage",
          foreignField: "_id",
          as: "stageDetails"
        }
      },
      { $unwind: "$stageDetails" }, // Deconstruct the stageDetails array
      { $sort: { "stageDetails.level": -1 } }, // Sort by stage level in descending order
      {
        $group: {
          _id: "$opportunity", // Group by opportunity to remove duplicates
          stage: { $first: "$stageDetails" }, // Pick the stage with the highest level
          opportunity: { $first: "$opportunityDetails" } // Pick the corresponding opportunity details
        }
      }
    ]);

    // Iterate through the results and map them to the corresponding stages
    opportunitiesInStages.forEach((record) => {
      const { stage, opportunity } = record;
      switch (stage.label.toLowerCase()) {
        case "lead":
          pipeView.lead.push(opportunity);
          break;
        case "prospecting":
          pipeView.prospect.push(opportunity);
          break;
        case "qualification":
          pipeView.qualification.push(opportunity);
          break;
        case "proposal":
          pipeView.proposal.push(opportunity);
          break;
        case "followup":
          pipeView.followup.push(opportunity);
          break;
        case "closing":
          pipeView.closing.push(opportunity);
          break;
        default:
          break;
      }
    });

    // Return the pipe view
    res.status(200).json({
      status: "success",
      message: "Pipe view retrieved successfully",
      data: pipeView
    });
  });
}

export default PipeViewController;
