import {dbConnect} from "./dbConnection.js";
import { faker } from '@faker-js/faker';
import {User} from "../models/user.model.js";
import {Department} from "../models/department.model.js";
import {Staff} from "../models/staff.model.js";
import {Event} from "../models/event.model.js";

dbConnect().catch((err) => {
    console.log(err)
})
console.log("Seeder Connected");
const numberOfUser = 50;
const numberOfDepartment = 100;
const numberOfStaff = 200;
const numberOfEvent = 50;

const userIds = []
for (let i = 0; i < numberOfUser; i++) {
    let user = new User({
        name: faker.person.fullName(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(["member", "admin", "editor"]),
        password: "password",
        avatar:faker.image.avatar(),
    })
    userIds.push(user._id)
    await user.save()
}
console.log(`${numberOfUser} users generated`)

const departmentIds = []
for (let i = 0; i < numberOfDepartment; i++) {
    let department = new Department({
        name_kh: faker.commerce.department(),
        name_en: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        active: faker.helpers.arrayElement([true, false]),
    })
    departmentIds.push(department._id)
    await department.save()
}
console.log(`${numberOfDepartment} departments generated`)


const staffIds = []
for (let i = 0; i < numberOfStaff; i++) {
    let staff = new Staff({
        name_kh: faker.person.fullName(),
        name_en: faker.person.fullName(),
        dob: faker.date.anytime(),
        gender: faker.helpers.arrayElement(['male', 'female']),
        position: faker.helpers.arrayElement(['Chef','Staff','Secretary', 'Manager']),
        description: faker.person.jobDescriptor(),
        active: faker.helpers.arrayElement([true, false]),

    })
    staffIds.push(staff._id)
    await staff.save()
}
console.log(`${numberOfStaff} staff generated`)

let staffs = await Staff.find()
staffs.forEach(async (item) => {
    item.department = faker.helpers.arrayElements(departmentIds, { min: 1, max: 1 })
    await item.save()
})

let departments = await Department.find()
departments.forEach(async (item) => {
    item.staffs = faker.helpers.arrayElements(staffIds, { min: 3, max: 5 })
    await item.save()
})

let users = await User.find()
users.forEach(async (item) => {
    item.staff = faker.helpers.arrayElements(staffIds, { min: 1, max: 1 })
    await item.save()
})

const eventIds = []
for (let i = 0; i < numberOfEvent; i++) {
    let event = new Event({
        title: faker.person.jobTitle(),
        start_date: faker.date.anytime(),
        end_date: faker.date.anytime(),
        description: faker.commerce.productDescription(),
        allow_guest: faker.helpers.arrayElement([true, false]),
        event_link: faker.internet.url(),
        qr_code: faker.image.url(),
        active: faker.helpers.arrayElement([true, false]),
    })
    eventIds.push(event._id)
    await event.save()
}
console.log(`${numberOfEvent} events generated`)

let events = await Event.find()
for (const item of events) {
    const selectedStaffs = faker.helpers.arrayElements(staffIds, { min: 3, max: 20 });
    item.event_staff = selectedStaffs.map(staffId => ({
        staff: staffId,
        is_joined: faker.helpers.arrayElement([true, false])
    }));
    await item.save()
}

console.log(`Seeder done!`)