import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

dotenv.config();

const dummyVehicles = [
  // BMW
  {
    make: 'BMW',
    model: 'M5 Competition',
    category: 'Sedan',
    price: 125000,
    quantity: 3,
    year: 2024,
    description: 'The ultimate driving machine with 617 HP V8 engine, 0-60 in 3.4 seconds.',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop'
  },
  {
    make: 'BMW',
    model: 'X5',
    category: 'SUV',
    price: 82000,
    quantity: 6,
    year: 2023,
    description: 'Premium midsize SUV with xDrive all-wheel drive and cutting-edge technology.',
    image_url: 'https://imgd.aeplcdn.com/1920x1080/n/cw/ec/152681/x5-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80&q=80'
  },
  // Mercedes-Benz
  {
    make: 'Mercedes-Benz',
    model: 'E-Class',
    category: 'Sedan',
    price: 85000,
    quantity: 5,
    year: 2023,
    description: 'Luxury sedan with cutting-edge technology and elegant design.',
    image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop'
  },
  {
    make: 'Mercedes-Benz',
    model: 'GLE',
    category: 'SUV',
    price: 88000,
    quantity: 3,
    year: 2024,
    description: 'Luxury SUV with elegant design and advanced driver assistance systems.',
    image_url: 'https://cdn-s3.autocarindia.com/legacy/cdni/mmv_images/colors/20250808042929_Mercedes-Benz_GLE_Selenite_Grey[1].jpg?w=640&q=75&fm=auto'
  },
  {
    make: 'Mercedes-Benz',
    model: 'S-Class',
    category: 'Luxury',
    price: 115000,
    quantity: 3,
    year: 2024,
    description: 'Flagship luxury sedan with advanced technology and premium comfort.',
    image_url: 'https://autodesignmagazine.com/wp-content/uploads/2020/09/2020090401_Mercedes_SClass.jpg'
  },
  // Audi
  {
    make: 'Audi',
    model: 'A6',
    category: 'Sedan',
    price: 78000,
    quantity: 4,
    year: 2024,
    description: 'Sophisticated executive sedan with Quattro all-wheel drive.',
    image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop'
  },
  {
    make: 'Audi',
    model: 'Q7',
    category: 'SUV',
    price: 75000,
    quantity: 5,
    year: 2023,
    description: 'Three-row luxury SUV with Quattro all-wheel drive and virtual cockpit.',
    image_url: 'https://ackodrive-prod.ackoassets.com/image/audi/q7/default/Specs.jpg'
  },
  // Tesla
  {
    make: 'Tesla',
    model: 'Model S',
    category: 'Sedan',
    price: 95000,
    quantity: 2,
    year: 2024,
    description: 'Electric luxury sedan with 405-mile range and full self-driving capability.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxgsvlM1CqbCg0t4lownSdgQ2SGmIpQedDT9VSTLOKmg&s=10'
  },
  {
    make: 'Tesla',
    model: 'Model X',
    category: 'Electric',
    price: 105000,
    quantity: 3,
    year: 2024,
    description: 'Electric SUV with falcon-wing doors and 348-mile range.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSlMZTbCDL9QBTvUlUqHmP8raQnw4TMTkkIEHNRcA65cojm1dfXnAJ238&s=10'
  },
  // Range Rover
  {
    make: 'Range Rover',
    model: 'Sport',
    category: 'SUV',
    price: 110000,
    quantity: 4,
    year: 2024,
    description: 'Luxury SUV with off-road capability and premium cabin.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtlooesmYxfIAL8-farp0vI6WID-NxpRJCNB5jHIw6d0aV_gVU3QcVOB3i&s=10'
  },
  // Porsche
  {
    make: 'Porsche',
    model: '911 Turbo S',
    category: 'Sports',
    price: 220000,
    quantity: 2,
    year: 2024,
    description: 'Iconic sports car with 640 HP and 0-60 in 2.6 seconds.',
    image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop'
  },
  // Ferrari
  {
    make: 'Ferrari',
    model: '296 GTB',
    category: 'Sports',
    price: 340000,
    quantity: 1,
    year: 2024,
    description: 'Mid-engine hybrid sports car with 819 HP and 0-60 in 2.9 seconds.',
    image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop'
  },
  // Lamborghini
  {
    make: 'Lamborghini',
    model: 'Huracán',
    category: 'Sports',
    price: 280000,
    quantity: 2,
    year: 2023,
    description: 'V10 supercar with 631 HP and all-wheel drive.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRryPaIWmYzi290ciFL5ILEJpH1efeud5kjY9256nMfTQ&s'
  },
  // Chevrolet
  {
    make: 'Chevrolet',
    model: 'Corvette Z06',
    category: 'Sports',
    price: 120000,
    quantity: 3,
    year: 2024,
    description: 'American supercar with 670 HP V8 and 0-60 in 2.6 seconds.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMdO9l-sHco3jvdjkR7jFOYdQOXWsM0X-qJgFFuCfWWQf1tpjG5MccmPfC&s=10'
  },
  {
    make: 'Chevrolet',
    model: 'Silverado ZR2',
    category: 'Truck',
    price: 85000,
    quantity: 3,
    year: 2024,
    description: 'Off-road focused truck with lifted suspension and rugged styling.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR90LkpFtgJ8drrmk88vsOec2zOv-39w6vEuDSlWCy-NBLIqx2Nm07x9n0&s=10'
  },
  // Rivian
  {
    make: 'Rivian',
    model: 'R1S',
    category: 'Electric',
    price: 98000,
    quantity: 4,
    year: 2024,
    description: 'Electric adventure SUV with 316-mile range and quad-motor all-wheel drive.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbHZdBtvWSot71RMK2iLek_Fdscdh2-4iBcnZtXvJcdxxIxvd5e1ehB0Y&s=10'
  },
  // Lucid
  {
    make: 'Lucid',
    model: 'Air',
    category: 'Electric',
    price: 125000,
    quantity: 2,
    year: 2024,
    description: 'Luxury electric sedan with 516-mile range and 0-60 in 3.0 seconds.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlBRJXSGv-I8NUXvmCA3xmkQh-wSgLU0e4Gnho-xQLGw&s=10'
  },
  // Bentley
  {
    make: 'Bentley',
    model: 'Continental GT',
    category: 'Luxury',
    price: 280000,
    quantity: 1,
    year: 2024,
    description: 'Grand tourer with W12 engine and handcrafted luxury interior.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9RXsptmx2CUN2miHulk29ZVJ9emveO1P465yFkqu_Pa33qKaXNldGiMY&s=10'
  },
  // Rolls-Royce
  {
    make: 'Rolls-Royce',
    model: 'Ghost',
    category: 'Luxury',
    price: 350000,
    quantity: 1,
    year: 2024,
    description: 'Ultimate luxury sedan with V12 engine and bespoke craftsmanship.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbREqP6u41iZlq2mN65S3zL-wOG2RlIiaNyRMnhzQixQ&s'
  },
  // Ford
  {
    make: 'Ford',
    model: 'F-150 Raptor',
    category: 'Truck',
    price: 95000,
    quantity: 4,
    year: 2024,
    description: 'High-performance off-road truck with 450 HP and FOX suspension.',
    image_url: 'https://imgd.aeplcdn.com/370x208/n/cw/ec/48389/left-front-three-quarter1.jpeg?q=80'
  },
  // Ram
  {
    make: 'Ram',
    model: '1500 TRX',
    category: 'Truck',
    price: 105000,
    quantity: 2,
    year: 2024,
    description: 'Supercharged V8 truck with 702 HP and off-road capability.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSc77YSvtDDPpweHsfAeddIOAWgCYpeHcay-k6uqiTOOA1vrVIet0xxKQU&s=10'
  },
];

// Dummy users


const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicles');

   

    // Insert dummy vehicles
    const insertedVehicles = await Vehicle.insertMany(dummyVehicles);
    console.log(`✅ Added ${insertedVehicles.length} vehicles to inventory`);

  

    console.log('\n📊 Summary:');
    console.log(`   - ${insertedVehicles.length} vehicles added`);
    

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();