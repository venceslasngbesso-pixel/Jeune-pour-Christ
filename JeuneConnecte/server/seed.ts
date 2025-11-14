import { db } from "./db";
import { members, contributions, attendances, activities, activityParticipants } from "@shared/schema";
import { SERVICE_TYPES, CONTRIBUTION_AMOUNTS } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(activityParticipants);
  await db.delete(activities);
  await db.delete(attendances);
  await db.delete(contributions);
  await db.delete(members);

  // Create members
  const memberData = [
    {
      firstName: "Jean",
      lastName: "Kamdem",
      dateOfBirth: "1995-03-15",
      churchRole: "Louangeur",
      externalRole: "Étudiant",
      neighborhood: "Essos",
      phone: "+237 677 123 456",
      isLeader: true,
      status: "active",
    },
    {
      firstName: "Marie",
      lastName: "Ngo",
      dateOfBirth: "1998-07-22",
      churchRole: "Intercesseur",
      externalRole: "Enseignante",
      neighborhood: "Bastos",
      phone: "+237 677 234 567",
      isLeader: true,
      status: "active",
    },
    {
      firstName: "Paul",
      lastName: "Mbida",
      dateOfBirth: "2000-11-10",
      churchRole: "Membre",
      externalRole: "Développeur",
      neighborhood: "Odza",
      phone: "+237 677 345 678",
      isLeader: false,
      status: "active",
    },
    {
      firstName: "Grace",
      lastName: "Atanga",
      dateOfBirth: "1997-05-18",
      churchRole: "Chorale",
      externalRole: "Infirmière",
      neighborhood: "Mimboman",
      phone: "+237 677 456 789",
      isLeader: false,
      status: "active",
    },
    {
      firstName: "David",
      lastName: "Fokam",
      dateOfBirth: "1999-09-25",
      churchRole: "Membre",
      externalRole: "Commerçant",
      neighborhood: "Mokolo",
      phone: "+237 677 567 890",
      isLeader: false,
      status: "active",
    },
    {
      firstName: "Sarah",
      lastName: "Tchoumi",
      dateOfBirth: "2001-02-14",
      churchRole: "Danse",
      externalRole: "Étudiante",
      neighborhood: "Ngoa Ekelle",
      phone: "+237 677 678 901",
      isLeader: false,
      status: "active",
    },
    {
      firstName: "Samuel",
      lastName: "Njoya",
      dateOfBirth: "1996-12-08",
      churchRole: "Technicien son",
      externalRole: "Ingénieur",
      neighborhood: "Tsinga",
      phone: "+237 677 789 012",
      isLeader: true,
      status: "active",
    },
    {
      firstName: "Esther",
      lastName: "Manga",
      dateOfBirth: "1998-04-30",
      churchRole: "Membre",
      externalRole: "Journaliste",
      neighborhood: "Omnisport",
      phone: "+237 677 890 123",
      isLeader: false,
      status: "active",
    },
  ];

  const createdMembers = await db.insert(members).values(memberData).returning();
  console.log(`✅ Created ${createdMembers.length} members`);

  // Create contributions for the current month
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const contributionData = createdMembers.map((member) => ({
    memberId: member.id,
    amount: member.isLeader ? CONTRIBUTION_AMOUNTS.LEADER : CONTRIBUTION_AMOUNTS.MEMBER,
    month: currentMonth,
    year: currentYear,
    status: "paid" as const,
    paidDate: new Date(),
  }));

  const createdContributions = await db.insert(contributions).values(contributionData).returning();
  console.log(`✅ Created ${createdContributions.length} contributions`);

  // Create some past contributions
  const pastContributionData = createdMembers.slice(0, 5).map((member) => ({
    memberId: member.id,
    amount: member.isLeader ? CONTRIBUTION_AMOUNTS.LEADER : CONTRIBUTION_AMOUNTS.MEMBER,
    month: currentMonth - 1,
    year: currentYear,
    status: "paid" as const,
    paidDate: new Date(currentYear, currentMonth - 2, 15),
  }));

  await db.insert(contributions).values(pastContributionData);
  console.log(`✅ Created ${pastContributionData.length} past contributions`);

  // Create attendance records
  const attendanceData = [];
  const today = new Date();
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - today.getDay());

  for (const member of createdMembers.slice(0, 6)) {
    attendanceData.push({
      memberId: member.id,
      serviceType: SERVICE_TYPES.SUNDAY_WORSHIP,
      date: lastSunday.toISOString().split('T')[0],
      present: true,
    });
  }

  const lastThursday = new Date(today);
  lastThursday.setDate(today.getDate() - ((today.getDay() + 3) % 7));

  for (const member of createdMembers.slice(0, 5)) {
    attendanceData.push({
      memberId: member.id,
      serviceType: SERVICE_TYPES.THURSDAY_EXHORTATION,
      date: lastThursday.toISOString().split('T')[0],
      present: true,
    });
  }

  const createdAttendances = await db.insert(attendances).values(attendanceData).returning();
  console.log(`✅ Created ${createdAttendances.length} attendance records`);

  // Create activities
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const activityData = [
    {
      title: "Retraite Spirituelle de la Jeunesse",
      description: "Une retraite de trois jours pour approfondir notre relation avec Dieu",
      date: futureDate,
      responsibleId: createdMembers[0].id,
      status: "upcoming" as const,
    },
    {
      title: "Action Sociale au Quartier",
      description: "Distribution de vivres et évangélisation dans le quartier Mokolo",
      date: new Date(futureDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      responsibleId: createdMembers[1].id,
      status: "upcoming" as const,
    },
    {
      title: "Concert de Louange",
      description: "Soirée de louange et d'adoration avec la chorale de la jeunesse",
      date: new Date(futureDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      responsibleId: createdMembers[6].id,
      status: "past" as const,
    },
  ];

  const createdActivities = await db.insert(activities).values(activityData).returning();
  console.log(`✅ Created ${createdActivities.length} activities`);

  // Add participants to activities
  const participantData = [];
  for (let i = 0; i < createdActivities.length; i++) {
    const numParticipants = Math.min(4 + i, createdMembers.length);
    for (let j = 0; j < numParticipants; j++) {
      participantData.push({
        activityId: createdActivities[i].id,
        memberId: createdMembers[j].id,
      });
    }
  }

  const createdParticipants = await db.insert(activityParticipants).values(participantData).returning();
  console.log(`✅ Created ${createdParticipants.length} activity participants`);

  console.log("🎉 Seeding completed successfully!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
