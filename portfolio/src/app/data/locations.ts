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
      jobTitle: 'Information Technology Apprentice',
      jobCompany: '336th Training Squadron',
      jobLocation: 'Keesler AFB - Biloxi, Mississippi',
      jobDates: '2017-2018',
      jobDetails: [
        {
          jobDuty: 'SharePoint Technician',
          jobDetails: [
            'Created basic team sites, pages and web-parts',
            'Managed permissions for organization of 100+ users',
          ],
        },
        {
          jobDuty: 'Records Management Student',
          jobDetails: [
            'Studied records disposition rules for federal records',
            'Assisted in records staging for the organization ',
          ],
        },
        {
          jobDuty: 'Information Technology Support',
          jobDetails: [
            'Trained in basic IT troubleshooting',
            'Assisted customers with collaboration management',
          ],
        },
      ],
      jobSkills: ['dependability', 'problem analysis', 'time management'],
      image: 'assets/patches/336.png',
    },
  }, // Mississippi
  {
    lat: 36.257,
    lon: 168,
    info: {
      jobTitle: 'Knowledge Management Specialist',
      jobCompany: '55th Communications Squadron',
      jobLocation: 'Offutt AFB - Omaha, Nebraska',
      jobDates: '2018-2021',
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
      jobSkills: ['communication', 'customer service', 'problem solving'],
      image: 'assets/patches/55.png',
    },
  }, // Omaha
  {
    lat: 12,
    lon: 310,
    info: {
      jobTitle: 'Lead Staff Officer',
      jobCompany: '449th Air Expeditionary Group',
      jobLocation: 'Camp Lemonnier - Djibouti, Africa',
      jobDates: '2019-2020',
      jobDetails: [
        {
          jobDuty: 'Executive Administrator',
          jobDetails: [
            'Developed online mission reporting process leveraging SharePoint workflows',
            'Researched, advanced, and promoted higher education means to 500+ Airmen',
          ],
        },
        {
          jobDuty: 'Cybersecurity Manager',
          jobDetails: [
            'Validated security clearance information for over 300 personnel',
            'Managed and approved network access for deployment rotation',
          ],
        },
      ],
      jobSkills: ['teamwork', 'flexibility', 'critical thinking'],
      image: 'assets/patches/449.png',
    },
  }, // Djibouti
  {
    lat: 25,
    lon: 398,
    info: {
      jobTitle: 'Data Operations Supervisor',
      jobCompany: '390th Intelligence Squadron',
      jobLocation: 'Kadena AB - Okinawa, Japan',
      jobDates: '2021 - 2023',
      jobDetails: [
        {
          jobDuty: 'IT Project Management',
          jobDetails: [
            'Led $227,000 tech-refresh that included deployment and configuration of 250 workstations',
            'Expanded BOCKSCAR network capabilities by installing four critical servers across multiple IT nodes',
          ],
        },
        {
          jobDuty: 'Senior SharePoint Admin',
          jobDetails: [
            'Developed in-house tracking application that seamlessly handled account processing, trouble tickets, change requests and project management: providing key metrics to stakeholders from the IT department',
          ],
        },
        {
          jobDuty: 'Cybersecurity and Information Assurance',
          jobDetails: [
            'Lead custodian on $150,000 account, validated 35 critical items for COMPUSEC regulations quarterly',
            'Oversaw a 6-member team that handled access control of the Air Force domains/networks',
          ],
        },
      ],
      jobSkills: ['leadership', 'creativity', 'empathy'],
      image: 'assets/patches/390.png',
    },
  }, // Okinawa
  {
    lat: 38,
    lon: 410,
    info: {
      jobTitle: 'Chief Support Services',
      jobCompany: 'DoD Special Representative Japan',
      jobLocation: 'Field Office - Japan',
      jobDates: '2023-2025',
      jobDetails: [
        {
          jobDuty: 'SharePoint Development',
          jobDetails: ['Pending declassification'],
        },
        {
          jobDuty: 'Records Management',
          jobDetails: ['Pending declassification'],
        },
        {
          jobDuty: 'Logistics & Protocol Operations',
          jobDetails: ['Pending declassification'],
        },
      ],
      jobSkills: [
        'decision making',
        'presentation skills',
        'strategic thinking',
      ],
      image: 'assets/patches/dsrj-o.png',
    },
  },
];
