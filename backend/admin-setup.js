const fs=require('fs'),path=require('path'),crypto=require('crypto'),readline=require('readline');
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
rl.question('Create admin password (minimum 12 characters): ', password=>{
 if(password.length<12){console.error('Password too short.');rl.close();process.exitCode=1;return;}
 const salt=crypto.randomBytes(16).toString('hex');const hash=crypto.scryptSync(password,salt,64).toString('hex');
 fs.writeFileSync(path.join(__dirname,'admin-credentials.json'),JSON.stringify({salt,hash},null,2),{mode:0o600});
 console.log('Admin password saved locally. Do not commit admin-credentials.json.');rl.close();
});
