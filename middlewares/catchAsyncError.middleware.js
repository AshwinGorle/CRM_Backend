export const catchAsyncError = (theFun) => (req, res, next) => {
    theFun(req, res, next).catch(next);
}

