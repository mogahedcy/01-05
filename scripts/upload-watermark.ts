/**
 * سكريبت لرفع الشعار إلى Cloudinary
 */
import { uploadWatermarkToCloudinary } from '../src/lib/cloudinary';

async function main() {
  console.log('🚀 بدء رفع الشعار إلى Cloudinary...');
  
  try {
    await uploadWatermarkToCloudinary();
    console.log('✅ تم رفع الشعار بنجاح!');
    process.exit(0);
  } catch (error) {
    console.error('❌ فشل رفع الشعار:', error);
    process.exit(1);
  }
}

main();
