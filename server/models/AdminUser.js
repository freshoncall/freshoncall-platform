import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true }
});

AdminUserSchema.statics.createDefault = async function(){
  const email = process.env.ADMIN_EMAIL || 'admin@freshoncall.local';
  const pass = process.env.ADMIN_PASSWORD || 'FreshOnCall2025';
  const hash = await bcrypt.hash(pass, 10);
  await this.create({ email, passwordHash: hash });
};

AdminUserSchema.methods.verifyPassword = async function(pw){
  return bcrypt.compare(pw, this.passwordHash);
};

export default mongoose.model('AdminUser', AdminUserSchema);