const mongoose = require('mongoose');

async function fixBirthdates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://betr:betr2024%40@cluster0.drjm0.mongodb.net/betr');
    
    console.log('Connected to MongoDB');
    
    // Get the User model
    const userSchema = new mongoose.Schema({
      dateOfBirth: mongoose.Schema.Types.Mixed,
    }, { strict: false });
    
    const User = mongoose.model('User', userSchema, 'users');
    
    console.log('Fetching all users...');
    const users = await User.find({});
    
    console.log(`Found ${users.length} users to process\n`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      if (user.dateOfBirth) {
        const dateValue = user.dateOfBirth;
        console.log(`User ${user._id}:`);
        console.log(`  Raw value: ${JSON.stringify(dateValue)}`);
        console.log(`  Type: ${typeof dateValue}`);
        
        let newDateStr = null;
        
        // Handle different date formats
        if (typeof dateValue === 'string') {
          // Try YYYY-MM-DD format
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            const [year, month, day] = dateValue.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            date.setDate(date.getDate() - 1);
            newDateStr = date.toISOString().split('T')[0];
          }
          // Try ISO date format
          else if (/^\d{4}-\d{2}-\d{2}T/.test(dateValue)) {
            const date = new Date(dateValue);
            date.setDate(date.getDate() - 1);
            newDateStr = date.toISOString().split('T')[0];
          }
        } else if (dateValue instanceof Date) {
          const date = new Date(dateValue);
          date.setDate(date.getDate() - 1);
          newDateStr = date.toISOString().split('T')[0];
        } else if (typeof dateValue === 'object' && dateValue !== null) {
          // Handle Date objects stored as objects
          try {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
              date.setDate(date.getDate() - 1);
              newDateStr = date.toISOString().split('T')[0];
            }
          } catch (err) {
            console.log('  Could not parse as date');
          }
        }
        
        if (newDateStr) {
          console.log(`  Updated: ${dateValue} -> ${newDateStr}`);
          await User.findByIdAndUpdate(user._id, { dateOfBirth: newDateStr });
          updatedCount++;
        } else {
          console.log('  Skipped (could not parse)');
        }
        console.log('');
      }
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} users`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing birthdates:', error);
    process.exit(1);
  }
}

fixBirthdates();
