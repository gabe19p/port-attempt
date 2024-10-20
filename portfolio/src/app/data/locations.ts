/**
 * locations data that will be imported into
 * the three.js globe file. update the data here
 */

// locations.ts
export const locations = [
  {
    lat: 28.7416,
    lon: 183,
    info: {
      jobTitle: 'IT Apprentice',
      jobLocation: 'Biloxi, Mississippi',
      image: 'assets/patches/336.png',
    },
  }, // Mississippi
  {
    lat: 36.257,
    lon: 168,
    info: {
      jobTitle: 'Knowledge Manager',
      jobCompany: '55th Communications Squadron',
      jobLocation: 'Offutt AFB - Omaha, Nebraska',
      jobDates: '2017-2021',
      jobDetails: [
        {
          jobDuty: 'SharePoint Admin',
          jobDetails: [
            'Project lead for development of COVID-19 tracking site and Airman promotion dashboard',
            'Led monthly training for 200+ delegates on SharePoint best practices and security measures',
            'Promoted organization process improvement techniques with collaboration management tools',
          ],
        },
        {
          jobDuty: 'Records Manager',
          jobDetails: [
            "Conducted quarterly audits to ensure compliance with record's disposition schedules",
            'Managed data life-cycle; inventoried, destroyed and archived over 90,000 records',
          ],
        },
        {
          jobDuty: 'Cybersecurity Liaison',
          jobDetails: [
            'Administered AFNet domain access utilizing Information Assurance Officer (IAO) Express',
            'JPAS experience verifying security clearance information and certification',
          ],
        },
      ],
      image: 'assets/patches/55.png',
    },
  }, // Omaha
  {
    lat: 12,
    lon: 310,
    info: {
      jobTitle: 'Executive Admin',
      jobLocation: 'Djibouti, Africa',
      image: 'assets/patches/449.png',
    },
  }, // Djibouti
  {
    lat: 25,
    lon: 398,
    info: {
      jobTitle: 'Data Operations Supervisor',
      jobLocation: 'Okinawa, Japan',
      image: 'assets/patches/390.png',
    },
  }, // Okinawa
];
