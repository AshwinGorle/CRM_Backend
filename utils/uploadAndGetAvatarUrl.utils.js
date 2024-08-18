const uploadAndGetAvatarUrl = (req)=>{
    const file = req.file
    const tempUploadDir = path.join(process.cwd(), "tempUpload");
    fs.writeFileSync(tempUploadDir, csv);
}

export default uploadAndGetAvatarUrl;