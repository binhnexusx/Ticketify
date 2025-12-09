  -- insert vào users
  INSERT INTO users (user_id, name, date_of_birth, gender, email, phone, address, avatar_url, refresh_token, first_name, last_name, role, is_active) VALUES
  (1, 'Sarah Chang', '1993-03-05', 'female', 'sarah.chang@example.com', '0123456789', '123 Maple St, Cityville', 'https://randomuser.me/api/portraits/women/1.jpg', '', 'Sarah', 'Chang', 'user', true),
  (2, 'Corey Bradley', '1980-10-16', 'male', 'corey.bradley@example.com', '0987654321', '456 Oak St, Townville', 'https://randomuser.me/api/portraits/men/2.jpg', '', 'Corey', 'Bradley', 'user', true),
  (3, 'Linda Nguyen', '1995-04-10', 'female', 'linda.nguyen@example.com', '0112233445', '789 Pine St, Villagetown', 'https://randomuser.me/api/portraits/women/3.jpg', '', 'Linda', 'Nguyen', 'user', true),
  (4, 'John Smith', '1987-12-02', 'male', 'john.smith@example.com', '0223344556', '321 Elm St, Suburbia', 'https://randomuser.me/api/portraits/men/4.jpg', '', 'John', 'Smith', 'user', true),
  (5, 'Emily Davis', '1990-07-25', 'female', 'emily.davis@example.com', '0334455667', '654 Cedar St, Metrocity', 'https://randomuser.me/api/portraits/women/5.jpg', '', 'Emily', 'Davis', 'user', true),
  (6, 'James Lee', '1992-09-13', 'male', 'james.lee@example.com', '0445566778', '987 Birch St, Bigcity', 'https://randomuser.me/api/portraits/men/6.jpg', '', 'James', 'Lee', 'user', true),
  (7, 'Anna Kim', '1998-11-30', 'female', 'anna.kim@example.com', '0556677889', '159 Spruce St, Capitaltown', 'https://randomuser.me/api/portraits/women/7.jpg', '', 'Anna', 'Kim', 'user', true),
  (8, 'David Martinez', '1985-06-22', 'male', 'david.martinez@example.com', '0667788990', '753 Walnut St, Hilltop', 'https://randomuser.me/api/portraits/men/8.jpg', '', 'David', 'Martinez', 'user', true),
  (9, 'Jessica Chen', '1991-01-14', 'female', 'jessica.chen@example.com', '0778899001', '852 Aspen St, Lakeside', 'https://randomuser.me/api/portraits/women/9.jpg', '', 'Jessica', 'Chen', 'user', true),
  (10, 'Brian Park', '1993-08-05', 'male', 'brian.park@example.com', '0889900112', '456 Fir St, Riverdale', 'https://randomuser.me/api/portraits/men/10.jpg', '', 'Brian', 'Park', 'user', true),
  (11, 'Olivia Wilson', '1996-03-03', 'female', 'olivia.wilson@example.com', '0991011122', '111 Redwood St, Bayview', 'https://randomuser.me/api/portraits/women/11.jpg', '', 'Olivia', 'Wilson', 'user', true),
  (12, 'Kevin Brown', '1989-05-20', 'male', 'kevin.brown@example.com', '0102023034', '222 Sequoia St, Greenhill', 'https://randomuser.me/api/portraits/men/12.jpg', '', 'Kevin', 'Brown', 'user', true),
  (13, 'Sophia Johnson', '1994-10-18', 'female', 'sophia.johnson@example.com', '0203044050', '333 Willow St, Mountainview', 'https://randomuser.me/api/portraits/women/13.jpg', '', 'Sophia', 'Johnson', 'user', true),
  (14, 'Daniel Moore', '1986-02-28', 'male', 'daniel.moore@example.com', '0304055060', '444 Palm St, Coastside', 'https://randomuser.me/api/portraits/men/14.jpg', '', 'Daniel', 'Moore', 'user', true),
  (15, 'Mia Taylor', '1997-09-01', 'female', 'mia.taylor@example.com', '0405066070', '555 Cypress St, Sunnytown', 'https://randomuser.me/api/portraits/women/15.jpg', '', 'Mia', 'Taylor', 'user', true),
  (16, 'Andrew Scott', '1991-11-11', 'male', 'andrew.scott@example.com', '0506077080', '666 Poplar St, Winterfield', 'https://randomuser.me/api/portraits/men/16.jpg', '', 'Andrew', 'Scott', 'user', true),
  (17, 'Grace Lewis', '1988-06-07', 'female', 'grace.lewis@example.com', '0607088090', '777 Maple St, Rainytown', 'https://randomuser.me/api/portraits/women/17.jpg', '', 'Grace', 'Lewis', 'user', true),
  (18, 'Henry Walker', '1984-04-21', 'male', 'henry.walker@example.com', '0708099101', '888 Beech St, Cloudcity', 'https://randomuser.me/api/portraits/men/18.jpg', '', 'Henry', 'Walker', 'user', true),
  (19, 'Natalie Young', '1999-07-15', 'female', 'natalie.young@example.com', '0809101112', '999 Alder St, Fogtown', 'https://randomuser.me/api/portraits/women/19.jpg', '', 'Natalie', 'Young', 'user', true),
  (20, 'Luke Hall', '1990-12-19', 'male', 'luke.hall@example.com', '0910111213', '1230 Cottonwood St, Windville', 'https://randomuser.me/api/portraits/men/20.jpg', '', 'Luke', 'Hall', 'user', true);


  -- insert vào room_types
  INSERT INTO "room_types" (room_type_id, name, max_people, price)
  VALUES 
  (1,'Single', 1, 50.00),
  (2,'Double', 2, 100.00),
  (3,'Triple', 3, 200.00);
  select * from room_types;
  INSERT INTO floors (floor_id, name)
  VALUES 
  (1,'Floor 1'),
  (2,'Floor 2'),
  (3,'Floor 3'),
  (4,'Floor 4'),
  (5,'Floor 5');
  -- insert vào room_levels
  INSERT INTO "room_levels" (room_level_id, name, price)
  VALUES 
  (1,'Standard', 50.00),
  (2,'Luxury', 100.00),
  (3,'Vip',200.00);
  select * from room_levels;

  -- insert vào rooms
  INSERT INTO "rooms" (room_id, name, room_type_id, room_level_id, status, description, floor_id)
  VALUES 
  (1,'Room 1001', 1, 1, 'available', 'A cozy single room with a bed and a desk.',1),
  (2,'Room 1002', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (3,'Room 1003', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (4,'Room 1004', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (5,'Room 1005', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (6,'Room 1006', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (7,'Room 1007', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (8,'Room 1008', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (9,'Room 1009', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (10,'Room 1010', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (11,'Room 1011', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (12,'Room 1012', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (13,'Room 1013', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (14,'Room 1014', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (15,'Room 1015', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (16,'Room 1016', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (17,'Room 1017', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (18,'Room 1018', 2, 2, 'available', 'A spacious double room with a nice view.',1),
  (19,'Room 1019', 3, 3, 'available', 'A luxurious suite with all amenities.',1),
  (20,'Room 1020', 3, 3, 'available', 'A luxurious suite with all amenities.',1),
  (21,'Room 2001', 3, 3, 'available', 'A luxurious suite with all amenities.',2),
  (22,'Room 2002', 3, 3, 'available', 'A luxurious suite with all amenities.',2);
  select * from rooms;

  -- insert vào room_images
  INSERT INTO room_images (room_id, image_url)
  VALUES
    (1, '/uploads/rooms/room_1.1.jpg'),
    (1, '/uploads/rooms/room_1.2.jpg'),
    (2, '/uploads/rooms/room_2.1.jpg'),
    (2, '/uploads/rooms/room_2.2.jpg'),
    (3, '/uploads/rooms/room_3.1.jpg'),
    (4, '/uploads/rooms/room_4.1.jpg'),
    (4, '/uploads/rooms/room_4.2.jpg'),
    (4, '/uploads/rooms/room_4.3.jpg'),
    (5, '/uploads/rooms/room_5.1.jpg'),
    (5, '/uploads/rooms/room_5.2.jpg'),
    (7, '/uploads/rooms/room_7.1.jpg'),
    (7, '/uploads/rooms/room_7.2.jpg'),
    (7, '/uploads/rooms/room_7.3.jpg'),
    (8, '/uploads/rooms/room_8.1.jpg'),
    (8, '/uploads/rooms/room_8.2.jpg'),
    (9, '/uploads/rooms/room_9.1.jpg'),
    (9, '/uploads/rooms/room_9.2.jpg'),
    (9, '/uploads/rooms/room_9.3.jpg'),
    (10, '/uploads/rooms/room_10.1.jpg'),
    (10, '/uploads/rooms/room_10.2.jpg'),
    (11, '/uploads/rooms/room_11.1.jpg'),
    (12, '/uploads/rooms/room_12.1.jpg'),
    (13, '/uploads/rooms/room_13.1.jpg'),
    (14, '/uploads/rooms/room_14.1.jpg'),
    (15, '/uploads/rooms/room_15.1.jpg'),
    (15, '/uploads/rooms/room_15.2.jpg'),
    (15, '/uploads/rooms/room_15.3.jpg'),
    (15, '/uploads/rooms/room_15.4.jpg'),
    (15, '/uploads/rooms/room_15.5.jpg'),
    (15, '/uploads/rooms/room_15.6.jpg'),
    (16, '/uploads/rooms/room_16.1.jpg'),
    (16, '/uploads/rooms/room_16.2.jpg'),
    (16, '/uploads/rooms/room_16.3.jpg'),
    (17, '/uploads/rooms/room_17.1.jpg'),
    (17, '/uploads/rooms/room_17.2.jpg'),
    (17, '/uploads/rooms/room_17.3.jpg'),
    (17, '/uploads/rooms/room_17.4.jpg'),
    (17, '/uploads/rooms/room_17.5.jpg'),
    (18, '/uploads/rooms/room_18.1.jpg'),
    (18, '/uploads/rooms/room_18.2.jpg'),
    (18, '/uploads/rooms/room_18.3.jpg'),
    (18, '/uploads/rooms/room_18.4.jpg'),
    (18, '/uploads/rooms/room_18.5.jpg'),
    (19, '/uploads/rooms/room_19.1.jpg'),
    (19, '/uploads/rooms/room_19.2.jpg'),
    (19, '/uploads/rooms/room_19.3.jpg'),
    (19, '/uploads/rooms/room_19.4.jpg'),
    (20, '/uploads/rooms/room_20.1.jpg'),
    (20, '/uploads/rooms/room_20.2.jpg'),
    (20, '/uploads/rooms/room_20.3.jpg'),
    (20, '/uploads/rooms/room_20.4.jpg'),
    (20, '/uploads/rooms/room_20.5.jpg'),
    (21, '/uploads/rooms/room_21.1.jpg'),
    (21, '/uploads/rooms/room_21.2.jpg'),
    (21, '/uploads/rooms/room_21.3.jpg'),
    (21, '/uploads/rooms/room_21.4.jpg'),
    (22, '/uploads/rooms/room_22.1.jpg'),
    (22, '/uploads/rooms/room_22.2.jpg'),
    (22, '/uploads/rooms/room_22.3.jpg'),
    (22, '/uploads/rooms/room_22.4.jpg'),
    (22, '/uploads/rooms/room_22.5.jpg'),
    (1, '/uploads/rooms/room_1.3.jpg'),
    (1, '/uploads/rooms/room_1.4.jpg'),
    (1, '/uploads/rooms/room_1.5.jpg'),
    (2, '/uploads/rooms/room_2.3.jpg'),
    (2, '/uploads/rooms/room_2.4.jpg'),
    (2, '/uploads/rooms/room_2.5.jpg'),
    (3, '/uploads/rooms/room_3.2.jpg'),
    (3, '/uploads/rooms/room_3.3.jpg'),
    (3, '/uploads/rooms/room_3.4.jpg'),
    (3, '/uploads/rooms/room_3.5.jpg'),
    (4, '/uploads/rooms/room_4.4.jpg'),
    (4, '/uploads/rooms/room_4.5.jpg'),
    (5, '/uploads/rooms/room_5.3.jpg'),
    (5, '/uploads/rooms/room_5.4.jpg'),
    (5, '/uploads/rooms/room_5.5.jpg'),
    (6, '/uploads/rooms/room_6.1.jpg'),
    (6, '/uploads/rooms/room_6.2.jpg'),
    (6, '/uploads/rooms/room_6.5.jpg'),
    (6, '/uploads/rooms/room_6.3.jpg'),
    (6, '/uploads/rooms/room_6.4.jpg'),
    (7, '/uploads/rooms/room_7.4.jpg');

  INSERT INTO amenities (amenity_id,name, icon)
  VALUES
    (1,'Free Wi-Fi', '/uploads/amenities/wifi.png'),
    (2,'Breakfast Included', '/uploads/amenities/tea.png'),
    (3,'Pets are Welcome', '/uploads/amenities/pet.png'),
    (4,'Free Parking', '/uploads/amenities/parking.png'),
    (5,'free laundry service', '/uploads/amenities/clothes-crew-neck.png'),
    (6,'Free Entrance Exercise Centre', '/uploads/amenities/sport.png');

    INSERT INTO room_amenities (room_id, amenity_id)
  VALUES
    (1, 1), (1, 2), (1, 3), (1, 4),
    (2, 1), (2, 2), (2, 3), (2, 5),
    (3, 1), (3, 4), (3, 5), (3, 6),
    (4, 2), (4, 3), (4, 5),
    (5, 1), (5, 2), (5, 3), (5, 6),
    (6, 1), (6, 2), (6, 4),
    (7, 2), (7, 3), (7, 5), (7, 6),
    (8, 1), (8, 3), (8, 4),
    (9, 1), (9, 2), (9, 5),
    (10, 3), (10, 4), (10, 6),
    (11, 1), (11, 2), (11, 3),
    (12, 1), (12, 4), (12, 5),
    (13, 2), (13, 3), (13, 6),
    (14, 1), (14, 5), (14, 6),
    (15, 2), (15, 4), (15, 5),
    (16, 1), (16, 3), (16, 6),
    (17, 2), (17, 4), (17, 5),
    (18, 1), (18, 3), (18, 6),
    (19, 1), (19, 2), (19, 4),
    (20, 3), (20, 4), (20, 5),
    (21, 1), (21, 2), (21, 6),
    (22, 2), (22, 3), (22, 5);

  INSERT INTO deals (deal_name, discount_rate, start_date, end_date, status, room_type)
  VALUES
  ('Deal for Single', 0.1, '2025-07-21', '2025-08-21', 'Ongoing', 1),
  ('Deal for Double', 0.15, '2025-07-21', '2025-08-21', 'Ongoing', 2),
  ('Deal for Triple', 0.2, '2025-07-21', '2025-08-21', 'Ongoing', 3);

  INSERT INTO bookings (booking_id, user_id, status, total_price) VALUES
  (1, 1, 'booked', 300.00),
  (2, 2, 'checked_in', 150.00),
  (3, 3, 'cancelled', 0.00),
  (4, 4, 'booked', 450.00),
  (5, 5, 'checked_in', 600.00),
  (6, 6, 'checked_out', 700.00),
  (7, 7, 'booked', 250.00),
  (8, 8, 'checked_in', 500.00),
  (9, 9, 'cancelled', 0.00),
  (10, 10, 'checked_out', 400.00);

  INSERT INTO booking_details (booking_detail_id, booking_id, room_id, price_per_unit, check_in_date, check_out_date) VALUES
  (1, 1, 1, 100.00, '2025-07-20', '2025-07-23'),
  (2, 2, 2, 75.00, '2025-07-19', '2025-07-20'),
  (3, 3, 3, 50.00, '2025-07-15', '2025-07-16'),
  (4, 4, 4, 150.00, '2025-07-18', '2025-07-21'),
  (5, 5, 5, 200.00, '2025-07-17', '2025-07-20'),
  (6, 6, 6, 350.00, '2025-07-14', '2025-07-17'),
  (7, 7, 7, 125.00, '2025-07-22', '2025-07-24'),
  (8, 8, 8, 250.00, '2025-07-20', '2025-07-22'),
  (9, 9, 9, 90.00, '2025-07-23', '2025-07-24'),
  (10, 10, 10, 200.00, '2025-07-16', '2025-07-18');


  INSERT INTO payments (booking_id, card_number, card_name, amount, method, exp_date, paid_at) VALUES
  (1, 4111111111111111, 'John Doe', 300.00, 'Visa', '2026-12-31', '2025-07-20'),
  (2, 5500000000000004, 'Jane Smith', 150.00, 'MasterCard', '2027-03-15', '2025-07-19'),
  (3, 340000000000009, 'Alice Brown', 0.00, 'American Express', '2025-11-01', '2025-07-15'),
  (4, 4111111111111111, 'Bob Johnson', 450.00, 'Visa', '2028-05-30', '2025-07-18'),
  (5, 5500000000000004, 'Emma Davis', 600.00, 'MasterCard', '2027-01-20', '2025-07-17'),
  (6, 4111111111111111, 'Chris Lee', 700.00, 'Visa', '2026-06-01', '2025-07-14'),
  (7, 340000000000009, 'Nancy White', 250.00, 'American Express', '2026-08-22', '2025-07-22'),
  (8, 4111111111111111, 'Peter King', 500.00, 'Visa', '2025-12-31', '2025-07-20'),
  (9, 5500000000000004, 'Sara Kim', 0.00, 'MasterCard', '2027-04-01', '2025-07-23'),
  (10, 340000000000009, 'Tom Wilson', 400.00, 'American Express', '2026-09-09', '2025-07-16');

  INSERT INTO feedbacks (booking_details_id, rating, comment, created_at) VALUES
  (1, 5, 'Phòng sạch sẽ, dịch vụ tốt!', '2025-07-24'),
  (2, 4, 'Nhân viên thân thiện, hơi ồn.', '2025-07-21'),
  (3, 2, 'Hủy đặt nhưng vẫn bị tính phí.', '2025-07-17'),
  (4, 5, 'Tuyệt vời! Sẽ quay lại.', '2025-07-22'),
  (5, 3, 'Giá hơi cao so với chất lượng.', '2025-07-21'),
  (6, 5, 'Mọi thứ đều tuyệt vời!', '2025-07-18'),
  (7, 4, 'Phòng đẹp, wifi yếu.', '2025-07-24'),
  (8, 5, 'Không có gì để chê!', '2025-07-23'),
  (9, 1, 'Hủy phòng không được hoàn tiền.', '2025-07-25'),
  (10, 3, 'Ổn áp, nhưng thiếu khăn tắm.', '2025-07-20');


  --update rooms_description

  UPDATE rooms
  SET description = 'Room 1011 is a spacious double room featuring large windows that provide ample natural light and a stunning view of the city skyline. Designed with comfort in mind, it includes two cozy beds, a writing desk, and a comfortable seating area. Guests can enjoy modern amenities such as a flat-screen TV, free Wi-Fi, and a mini-bar. The room is perfect for couples or friends traveling together, offering a relaxing retreat after a day of exploring the local attractions. With a stylish decor and warm colors, Room 1011 ensures a pleasant stay for all guests.'
  WHERE room_id = 11;

  UPDATE rooms
  SET description = 'Room 1012 offers a delightful experience with its elegant decor and inviting atmosphere. This double room is equipped with two plush beds, ensuring a restful night’s sleep. It features a spacious layout with a desk for work or study, and a seating area for relaxation. Guests can enjoy a variety of amenities, including a mini-fridge, coffee maker, and complimentary high-speed internet. The large windows overlook the garden, providing a serene view that enhances the overall ambiance of the room.'
  WHERE room_id = 12;

  UPDATE rooms
  SET description = 'Room 1013 is designed for comfort and relaxation, featuring two comfortable beds and a stylish interior. This double room includes all the essential amenities, such as a large flat-screen TV, a writing desk, and a cozy armchair. Guests can enjoy the convenience of a mini-bar stocked with refreshments and complimentary Wi-Fi access. The room’s decor combines modern elements with a touch of warmth, creating a welcoming environment for both leisure and business travelers.'
  WHERE room_id = 13;

  UPDATE rooms
  SET description = 'Room 1014 is a beautifully appointed double room that offers a mix of style and comfort. With two spacious beds, it is perfect for friends or family traveling together. The room includes a work desk, a seating area, and a variety of modern amenities to enhance your stay. Enjoy the stunning views from the large windows, and take advantage of the complimentary Wi-Fi and in-room dining services. This room provides a perfect retreat after a busy day in the city.'
  WHERE room_id = 14;

  UPDATE rooms
  SET description = 'Room 1015 features a contemporary design with two comfortable beds, ideal for travelers seeking relaxation. The room is equipped with a desk, a flat-screen TV, and a mini-fridge for convenience. Natural light floods the space through large windows that offer a picturesque view of the surroundings. Guests will appreciate the thoughtful touches, including complimentary toiletries and high-speed internet, ensuring a pleasant and enjoyable stay.'
  WHERE room_id = 15;

  UPDATE rooms
  SET description = 'Room 1016 is an inviting double room that combines comfort and functionality. Furnished with two cozy beds, it is well-suited for both leisure and business travelers. The room features a writing desk, a comfortable seating area, and a range of amenities including a mini-bar and free Wi-Fi. Guests can unwind and enjoy the view from the large windows, making this room a perfect choice for a relaxing getaway.'
  WHERE room_id = 16;

  UPDATE rooms
  SET description = 'Room 1017 is a charming double room that offers a tranquil ambiance for guests. With two well-appointed beds, it provides a restful escape after a long day. The room is equipped with a desk, a flat-screen TV, and a mini-fridge for added convenience. Large windows allow plenty of natural light to fill the space, creating a warm and inviting atmosphere. Enjoy complimentary Wi-Fi access and a variety of in-room amenities to enhance your stay.'
  WHERE room_id = 17;

  UPDATE rooms
  SET description = 'Room 1018 is a lovely double room that emphasizes comfort and relaxation. Featuring two spacious beds, it is perfect for friends or couples traveling together. The room includes a desk for work, a cozy seating area, and modern amenities such as a flat-screen TV and complimentary Wi-Fi. Guests can enjoy the beautiful view from the windows, making this room an ideal choice for a peaceful retreat in the heart of the city.'
  WHERE room_id = 18;

  UPDATE rooms
  SET description = 'Room 1019 is a luxurious suite designed for guests seeking an elevated experience. Featuring high-end furnishings and a spacious layout, this suite includes a comfortable king-size bed, a sitting area, and a large desk for work. Modern amenities such as a mini-bar, coffee maker, and high-speed internet ensure a convenient stay. Guests can take in stunning views from the large windows, creating a perfect backdrop for relaxation and enjoyment.'
  WHERE room_id = 19;

  UPDATE rooms
  SET description = 'Room 1020 is an exquisite suite that offers a blend of luxury and comfort. With elegant decor and a spacious floor plan, this room includes a king-size bed, a cozy seating area, and a work desk. Guests can enjoy a range of amenities, including a flat-screen TV, mini-bar, and complimentary Wi-Fi. The large windows provide breathtaking views of the city, enhancing the overall experience for those looking to indulge in a lavish stay.'
  WHERE room_id = 20;

  UPDATE rooms
  SET description = 'Room 2001 is a luxurious suite that promises a remarkable experience for guests. Designed with elegance and comfort in mind, it features a king-size bed, a separate living area, and a work desk. Guests can enjoy modern amenities such as a flat-screen TV, mini-bar, and high-speed internet. The room’s large windows offer stunning views of the city skyline, providing a serene atmosphere for relaxation and enjoyment.'
  WHERE room_id = 21;

  UPDATE rooms
  SET description = 'Room 2002 is a stylish and spacious suite that caters to guests looking for luxury and comfort. With a comfortable king-size bed and a cozy sitting area, this room is perfect for unwinding after a busy day. It features a desk for work, a flat-screen TV, and a mini-bar stocked with refreshments. The large windows provide a beautiful view, making this suite an ideal choice for a memorable stay.'
  WHERE room_id = 22;

  UPDATE rooms
  SET description = 'Room 1001 is a charming single room that offers a cozy atmosphere for travelers. Featuring a comfortable bed and a desk, this room is perfect for those on the go. Guests can enjoy modern amenities such as free Wi-Fi, a flat-screen TV, and a mini-fridge. Natural light fills the room from the window, creating a warm and welcoming environment for a pleasant stay.'
  WHERE room_id = 1;

  UPDATE rooms
  SET description = 'Room 1002 is a delightful double room that combines comfort with style. With two spacious beds, it is ideal for friends or family traveling together. The room includes a desk for work or study, a flat-screen TV, and a mini-fridge for added convenience. Guests can enjoy the lovely view from the windows, creating a relaxing atmosphere that enhances their overall experience.'
  WHERE room_id = 2;

  UPDATE rooms
  SET description = 'Room 1004 is a beautiful double room that emphasizes comfort and relaxation. Featuring two cozy beds, it is perfect for guests seeking a restful retreat. The room is equipped with a writing desk, a flat-screen TV, and complimentary Wi-Fi. Guests can unwind and enjoy the view from the large windows, making this room an ideal choice for a pleasant stay.'
  WHERE room_id = 4;

  UPDATE rooms
  SET description = 'Room 1005 is a stylish double room that offers a tranquil ambiance for guests. With two comfortable beds, it is well-suited for both leisure and business travelers. The room features a desk, a cozy seating area, and a range of amenities including a mini-bar and free Wi-Fi. Guests can enjoy the beautiful view from the windows, creating a perfect setting for relaxation.'
  WHERE room_id = 5;

  UPDATE rooms
  SET description = 'Room 1007 is a charming double room that combines comfort and functionality. Furnished with two cozy beds, it is ideal for travelers seeking relaxation. The room is equipped with a desk, a flat-screen TV, and a mini-fridge for convenience. Large windows allow plenty of natural light to fill the space, making this room a welcoming retreat.'
  WHERE room_id = 7;

  UPDATE rooms
  SET description = 'Room 1008 is a delightful double room that emphasizes comfort and style. Featuring two spacious beds, it is perfect for friends or family traveling together. The room includes a desk for work or study, a flat-screen TV, and a mini-fridge for added convenience. Guests can enjoy the lovely view from the windows, creating a relaxing atmosphere that enhances their overall experience.'
  WHERE room_id = 8;

  UPDATE rooms
  SET description = 'Room 1010 is a beautifully appointed double room that offers a mix of style and comfort. With two comfortable beds, it is perfect for guests seeking relaxation. The room includes a work desk, a flat-screen TV, and a variety of modern amenities to enhance your stay. Enjoy the stunning views from the large windows, making this room a perfect choice for a relaxing getaway.'
  WHERE room_id = 10;

  UPDATE rooms
  SET description = 'Room 1003 is a cozy double room that emphasizes comfort and relaxation. Furnished with two spacious beds, it is ideal for travelers seeking a restful retreat. The room includes a desk, a flat-screen TV, and complimentary Wi-Fi. Guests can unwind and enjoy the view from the large windows, making this room an ideal choice for a pleasant stay.'
  WHERE room_id = 3;

  UPDATE rooms
  SET description = 'Room 1006 is a lovely double room that combines comfort with functionality. Featuring two cozy beds, it is well-suited for both leisure and business travelers. The room is equipped with a writing desk, a flat-screen TV, and a mini-fridge for convenience. Large windows allow plenty of natural light to fill the space, creating a warm and inviting atmosphere for a pleasant stay.'
  WHERE room_id = 6;

  UPDATE rooms
  SET description = 'Room 1009 is a charming double room that offers a tranquil ambiance for guests. With two comfortable beds, it is perfect for friends or couples traveling together. The room includes a desk for work, a flat-screen TV, and a mini-fridge for added convenience. Guests can enjoy the beautiful view from the windows, making this room an ideal choice for a relaxing getaway.'
  WHERE room_id = 9;

  INSERT INTO amenities(amenity_id, name, icon)
  VALUES 
  (7,'Fitness', '/uploads/amenities/dumbbell.png'),
  (8,'Air Conditioning', '/uploads/amenities/heavy-wind.png'),
  (9,'Room Services', '/uploads/amenities/single-bed.png');

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (1, 6), (1, 7), (1, 8);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (2, 6), (2, 7), (2, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (3, 2), (3, 7), (3, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (4, 1), (4, 6), (4, 7);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (5, 4), (5, 7), (5, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (6, 3), (6, 5), (6, 6), (6, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (7, 1), (7, 4), (7, 8);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (8, 2), (8, 5), (8, 7);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (9, 3), (9, 4), (9, 6), (9, 8);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (10, 1), (10, 2), (10, 7), (10, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (11, 4), (11, 5), (11, 6), (11, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (12, 2), (12, 3), (12, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (13, 1), (13, 4), (13, 5), (13, 7);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (14, 2), (14, 3), (14, 4), (14, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (15, 1), (15, 3), (15, 6), (15, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (16, 2), (16, 4), (16, 5), (16, 7);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (17, 1), (17, 6), (17, 7), (17, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (18, 2), (18, 4), (18, 5);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (19, 3), (19, 5), (19, 6), (19, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (20, 1), (20, 2), (20, 6), (20, 7);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (21, 3), (21, 4), (21, 5), (21, 9);

  INSERT INTO room_amenities (room_id, amenity_id) VALUES
  (22, 1), (22, 4), (22, 6), (22, 7);
