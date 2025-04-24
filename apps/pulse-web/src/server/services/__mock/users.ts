import { ComboBoxOption } from '@/server/types/combo-box';
import { PaginatedData } from '@/server/types/pagination';
import { User, UserRole, UserStatus } from '@/server/types/users';

export const generateRandomUser = (): User => {
  const firstNames = [
    'John',
    'Jane',
    'Mike',
    'Sarah',
    'David',
    'Emily',
    'Alex',
    'Lisa',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
  ];
  const roles: UserRole[] = ['admin', 'production'];
  const statuses: UserStatus[] = ['active', 'inactive'];

  return {
    id: Math.floor(Math.random() * 1000).toString(),
    first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
    last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}.${lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: false,
  };
};

export const getUsersMocked = (): PaginatedData<User> => {
  const page = 1,
    page_size = 15;
  const totalUsers = 50;

  const allUsers = Array.from({ length: totalUsers }, generateRandomUser);

  const startIndex = (page - 1) * page_size;
  const endIndex = startIndex + page_size;
  const paginatedUsers = allUsers.slice(startIndex, endIndex);

  return {
    items: paginatedUsers,
    pagination: {
      page: page,
      per_page: page_size,
      total: totalUsers,
    },
  };
};
export const userRoles: ComboBoxOption[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Production', value: 'production' },
];

export const userStatus: ComboBoxOption[] = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];
