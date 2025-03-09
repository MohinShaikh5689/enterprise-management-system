import { PrismaClient, Role, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // Create departments first
  console.log('Creating departments...');
  const departmentNames = ['Engineering', 'Marketing', 'Finance', 'HR', 'Product', 'Sales', 'Customer Support', 'Legal'];
  
  const departmentPromises = departmentNames.map(name => 
    prisma.department.create({
      data: {
        name,
      }
    })
  );
  
  const departments = await Promise.all(departmentPromises);
  console.log(`Created ${departments.length} departments`);

  // Create 50 admins with department references
  console.log('Creating admins...');
  const adminPromises = Array(50).fill(0).map(async (_, i) => {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const randomDepartment = faker.helpers.arrayElement(departments);
    
    return prisma.admin.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email({ provider: 'gmail.com' }),
        password: hashedPassword,
        role: Role.ADMIN,
        departmentId: randomDepartment.id,  // Connect admin to a department
      },
    });
  });
  const admins = await Promise.all(adminPromises);
  console.log(`Created ${admins.length} admins`);

  // Create 200 employees
  console.log('Creating employees...');
  const employeePromises = Array(200).fill(0).map(async (_, i) => {
    const hashedPassword = await bcrypt.hash('Employee@123', 10);
    const randomDepartment = faker.helpers.arrayElement(departments);
    
    return prisma.employee.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: Role.EMPLOYEE,
        department: {
          connect: { id: randomDepartment.id }
        },
      },
    });
  });
  const employees = await Promise.all(employeePromises);
  console.log(`Created ${employees.length} employees`);

  // Create tasks spread across the entire year
  console.log('Creating tasks for the entire year...');
  const taskStatuses = [Status.PENDING, Status.IN_PROGRESS, Status.COMPLETED];
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Function to create tasks for a specific month
  const createTasksForMonth = async (month, count) => {
    const tasks: Promise<any>[] = [];
    for (let i = 0; i < count; i++) {
      const randomAdmin = faker.helpers.arrayElement(admins);
      const randomEmployee = faker.helpers.arrayElement(employees);
      
      // Create date in the specified month
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0); // Last day of month
      
      const createdAt = faker.date.between({ from: startDate, to: endDate });
      
      // Due date is 1-4 weeks after created date
      const dueDate = new Date(createdAt);
      dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 7, max: 28 }));
      
      // Task completion probability varies by how old the task is
      let statusDistribution;
      if (month < currentMonth - 3) {
        // Tasks from more than 3 months ago: very high completion rate
        statusDistribution = [Status.COMPLETED, Status.COMPLETED, Status.COMPLETED, Status.COMPLETED, Status.IN_PROGRESS];
      } else if (month < currentMonth - 1) {
        // Tasks from 1-3 months ago: high completion rate
        statusDistribution = [Status.PENDING, Status.IN_PROGRESS, Status.COMPLETED, Status.COMPLETED, Status.COMPLETED];
      } else if (month === currentMonth - 1) {
        // Tasks from last month: medium completion rate
        statusDistribution = [Status.PENDING, Status.IN_PROGRESS, Status.COMPLETED, Status.COMPLETED];
      } else {
        // Tasks from current month: lower completion rate
        statusDistribution = [Status.PENDING, Status.PENDING, Status.IN_PROGRESS, Status.COMPLETED];
      }
      
      const status = faker.helpers.arrayElement(statusDistribution) as Status;
      
      const task = prisma.task.create({
        data: {
          title: faker.lorem.sentence({ min: 3, max: 8 }),
          description: faker.lorem.paragraph(),
          status: status,
          createdAt: createdAt,
          updatedAt: createdAt,
          adminId: randomAdmin.id,
          assignedTo: randomEmployee.id,
        },
      });
      
      tasks.push(task);
    }
    
    return Promise.all(tasks);
  };

  // Create tasks for each month of the year with varying task counts
  // Pattern: fewer tasks in early year, peak in middle, then slight decline
  const monthlyTaskCounts = [
    30,  // January
    40,  // February
    50,  // March
    70,  // April
    90,  // May
    100, // June
    110, // July
    100, // August
    80,  // September
    70,  // October
    60,  // November
    50   // December
  ];
  
  let totalCreatedTasks = 0;
  const allMonthTasks: any[] = [];
  
  // Only create tasks up to the current month
  const monthsToCreate = Math.min(12, currentMonth + 1);
  
  for (let month = 0; month < monthsToCreate; month++) {
    // If we're in the current year, only create tasks up to current month
    if (month <= currentMonth) {
      const taskCount = monthlyTaskCounts[month];
      const monthTasks = await createTasksForMonth(month, taskCount);
      allMonthTasks.push(...monthTasks);
      console.log(`Created ${monthTasks.length} tasks for ${new Date(currentYear, month, 1).toLocaleString('default', { month: 'long' })}`);
      totalCreatedTasks += monthTasks.length;
    }
  }

  console.log(`Created a total of ${totalCreatedTasks} tasks across all months`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });