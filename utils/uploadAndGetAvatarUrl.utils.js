import path from 'path'
import fs from 'fs'
import uploadToCloudinary from './uploadToCloudinary.js';

const uploadAndGetAvatarUrl = async (path, resource, resourceId) => {
    const avatarUrl = await uploadToCloudinary(path, `CRM/Profile/${resource}`,resourceId,2);
    fs.unlinkSync(path);
    return avatarUrl;
};


export default uploadAndGetAvatarUrl;