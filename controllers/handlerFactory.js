const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const query = await Model.findById(req.params.id);

    if (!query) {
      return next(new AppError("No Document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: query,
      },
    });
  });
exports.getAll = (Model) => 
  catchAsync(async (req, res, next) => {
    const docs = await Model.find();

    res.status(200).json({
      status: "success",
      result: docs.length,
      data: {
        data: docs,
      },
    });
  });
;
