import { DataSource } from 'typeorm';
import { Room } from '../../rooms/room.entity';
import { MenuItem } from '../../restaurant/menu-item.entity';
import { User } from '../../users/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedInitialData(dataSource: DataSource) {
  const roomRepo = dataSource.getRepository(Room);
  const menuRepo = dataSource.getRepository(MenuItem);
  const userRepo = dataSource.getRepository(User);

  // Check if already seeded
  const roomCount = await roomRepo.count();
  if (roomCount === 0) {
    await roomRepo.save([
      { name: 'Deluxe Ocean View', description: 'Spacious room with stunning ocean views...', pricePerNight: 250, capacity: 2, imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b' },
      { name: 'Executive Suite', description: 'Luxurious suite with separate living area...', pricePerNight: 450, capacity: 4, imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304' },
      // ... add all rooms
    ]);
    console.log('Rooms seeded');
  }

  const menuCount = await menuRepo.count();
  if (menuCount === 0) {
    await menuRepo.save([
      { name: 'Grilled Salmon', description: 'Fresh Atlantic salmon...', price: 28.50, category: 'Main' },
      // ... add all menu items
    ]);
    console.log('Menu items seeded');
  }

  const userCount = await userRepo.count();
  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userRepo.save({
      email: 'admin@kingsluxury.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    });
    console.log('Admin user seeded');
  }
}