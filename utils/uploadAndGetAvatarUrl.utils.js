import path from 'path'
import fs from 'fs'
import uploadToCloudinary from './uploadToCloudinary.js';
const uploadAndGetAvatarUrl = async (req, resource, resourceId ) => {
    const avatarUrl = await uploadToCloudinary(req.file.path, `CRM/Profile/${resource}`,resourceId,2);
    fs.unlinkSync(req.file.path);
    return avatarUrl;
};


export default uploadAndGetAvatarUrl;