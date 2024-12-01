const Comment = require("./../models/commentModel");
const factory = require("./handlerFactory");

exports.createComment = factory.createOne(Comment);
exports.getComment = factory.getOne(Comment);
exports.getAllComments = factory.getAll(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
