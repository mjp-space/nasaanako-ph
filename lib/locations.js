// ============================================================
// TEMP — Remove these when done testing (just delete this block)
// ============================================================
export const TEMP_PINNED_LOCATIONS = [
  { lat: 14.3952544, lng: 120.9587179, name: "17 Avenida Rizal, Imus, Cavite",            hint: "Imus, Cavite" },
  { lat: 14.3952650, lng: 120.9595260, name: "Topacio St, Imus, Cavite",                  hint: "Imus, Cavite" },
  { lat: 14.3953848, lng: 120.9598414, name: "192 Diokno St cor Topacio, Imus, Cavite",   hint: "Imus, Cavite" },
]
// ============================================================

export const LOCATIONS = [
  // === METRO MANILA ===
  { lat: 14.5895, lng: 120.9750, name: "Intramuros, Manila",                hint: "Historic walled city" },
  { lat: 14.5831, lng: 120.9794, name: "Rizal Park, Manila",                hint: "National monument area" },
  { lat: 14.5994, lng: 120.9842, name: "Quiapo Church, Manila",             hint: "Home of the Black Nazarene" },
  { lat: 14.5995, lng: 120.9842, name: "Binondo, Manila",                   hint: "Oldest Chinatown in the world" },
  { lat: 14.5910, lng: 120.9730, name: "Fort Santiago, Manila",             hint: "Spanish-era fortress" },
  { lat: 14.5790, lng: 121.0020, name: "Ermita, Manila",                    hint: "Tourist belt of Manila" },
  { lat: 14.5743, lng: 120.9941, name: "Paco Park, Manila",                 hint: "Garden cemetery turned park" },
  { lat: 14.6091, lng: 121.0222, name: "Cubao, Quezon City",                hint: "Gateway to Araneta Center" },
  { lat: 14.6507, lng: 121.0486, name: "UP Diliman, Quezon City",           hint: "State university campus" },
  { lat: 14.6760, lng: 121.0437, name: "Quezon Memorial Circle, QC",        hint: "Commonwealth-era monument" },
  { lat: 14.6488, lng: 121.0686, name: "SM North EDSA, Quezon City",        hint: "One of the largest malls" },
  { lat: 14.6320, lng: 121.0440, name: "Trinoma Mall, Quezon City",         hint: "North Triangle commercial hub" },
  { lat: 14.6600, lng: 121.0600, name: "Anonas, Quezon City",               hint: "Residential QC neighborhood" },
  { lat: 14.6900, lng: 121.0800, name: "Batasan Hills, Quezon City",        hint: "Where Congress meets" },
  { lat: 14.7120, lng: 121.0510, name: "Novaliches, Quezon City",           hint: "Northern Quezon City" },
  { lat: 14.5547, lng: 121.0244, name: "Makati CBD",                        hint: "Financial district" },
  { lat: 14.5491, lng: 121.0513, name: "BGC, Taguig",                       hint: "Bonifacio Global City" },
  { lat: 14.5553, lng: 121.0302, name: "Rockwell Center, Makati",           hint: "Upscale lifestyle district" },
  { lat: 14.5640, lng: 121.0180, name: "Greenbelt, Makati",                 hint: "Upscale mall strip in Makati" },
  { lat: 14.5378, lng: 121.0014, name: "Pasay City, NAIA area",             hint: "Near the main airport" },
  { lat: 14.5320, lng: 120.9940, name: "Baclaran, Parañaque",               hint: "Famous flea market area" },
  { lat: 14.5213, lng: 121.0520, name: "Alabang, Muntinlupa",               hint: "Southern Metro Manila hub" },
  { lat: 14.5764, lng: 121.0851, name: "Ortigas Center, Pasig",             hint: "Mega Manila business hub" },
  { lat: 14.5600, lng: 121.0880, name: "Kapitolyo, Pasig",                  hint: "Food hub of Pasig" },
  { lat: 14.6272, lng: 121.0341, name: "San Juan City",                     hint: "Smallest city in Metro Manila" },
  { lat: 14.6100, lng: 121.0600, name: "Camp Crame, Quezon City",           hint: "PNP headquarters" },
  { lat: 14.5800, lng: 121.0590, name: "Mandaluyong City",                  hint: "Tiger City of the Philippines" },
  { lat: 14.5700, lng: 121.0400, name: "Shaw Blvd, Mandaluyong",            hint: "Major Mandaluyong thoroughfare" },
  { lat: 14.5630, lng: 121.0010, name: "Malate, Manila",                    hint: "Cultural district of Manila" },
  { lat: 14.6000, lng: 121.0700, name: "Marikina City Hall",                hint: "Shoe capital of the Philippines" },
  { lat: 14.5770, lng: 121.1140, name: "Antipolo Road, Cainta Rizal",       hint: "Eastern Metro Manila gateway" },

  // === LUZON - ILOCOS REGION ===
  { lat: 17.5747, lng: 120.3869, name: "Vigan City Plaza",                  hint: "UNESCO Heritage city" },
  { lat: 17.5830, lng: 120.3870, name: "Calle Crisologo, Vigan",            hint: "Cobblestone heritage street" },
  { lat: 17.5760, lng: 120.3890, name: "Vigan Cathedral",                   hint: "St. Paul Metropolitan Cathedral" },
  { lat: 17.8942, lng: 120.7371, name: "Laoag City, Ilocos Norte",          hint: "Tobacco country capital" },
  { lat: 17.9000, lng: 120.7430, name: "Laoag Cathedral",                   hint: "Sinking bell tower landmark" },
  { lat: 18.1961, lng: 120.5937, name: "Pagudpud, Ilocos Norte",            hint: "Windmills and beaches" },
  { lat: 18.1986, lng: 120.5936, name: "Bangui Windmills, Ilocos Norte",    hint: "Iconic coastal wind farm" },
  { lat: 17.6015, lng: 120.3872, name: "Santa Maria Church, Ilocos Sur",    hint: "UNESCO World Heritage church" },
  { lat: 16.9287, lng: 120.6563, name: "San Fernando City, La Union",       hint: "Surfing capital up north" },
  { lat: 16.6137, lng: 120.3189, name: "Paoay Church, Ilocos Norte",        hint: "Earthquake Baroque church" },
  { lat: 17.2716, lng: 120.4556, name: "Batac, Ilocos Norte",               hint: "Marcos birthplace city" },
  { lat: 17.0659, lng: 120.6029, name: "Narvacan, Ilocos Sur",              hint: "Ilocos coastal town" },
  { lat: 16.4979, lng: 120.3901, name: "Tagudin, Ilocos Sur",               hint: "Southern tip of Ilocos Sur" },

  // === LUZON - CORDILLERA ===
  { lat: 16.4023, lng: 120.5960, name: "Burnham Park, Baguio",              hint: "Summer capital of the PH" },
  { lat: 16.4120, lng: 120.5930, name: "Session Road, Baguio",              hint: "Baguio's main commercial strip" },
  { lat: 16.4141, lng: 120.5994, name: "Baguio Cathedral",                  hint: "Our Lady of the Atonement" },
  { lat: 16.4200, lng: 120.6060, name: "Camp John Hay, Baguio",             hint: "Former US rest & recreation camp" },
  { lat: 17.3475, lng: 121.1729, name: "Banaue, Ifugao",                    hint: "UNESCO rice terraces" },
  { lat: 17.0617, lng: 121.1297, name: "Lagawe, Ifugao",                    hint: "Capital of Ifugao province" },
  { lat: 17.3382, lng: 120.9020, name: "Sagada, Mountain Province",         hint: "Hanging coffins and caves" },
  { lat: 17.1127, lng: 120.9027, name: "Bontoc, Mountain Province",         hint: "Capital of Mountain Province" },
  { lat: 16.9800, lng: 121.1200, name: "Kiangan, Ifugao",                   hint: "Site of Japanese WWII surrender" },
  { lat: 16.5510, lng: 120.7890, name: "Benguet, La Trinidad",              hint: "Strawberry capital of the PH" },

  // === LUZON - CAGAYAN VALLEY ===
  { lat: 16.9287, lng: 121.7750, name: "Tuguegarao City, Cagayan",          hint: "Gateway to Cagayan Valley" },
  { lat: 16.8547, lng: 121.5630, name: "Cauayan City, Isabela",             hint: "Breadbasket of the North" },
  { lat: 16.4793, lng: 121.8409, name: "Ilagan City, Isabela",              hint: "Capital of Isabela province" },
  { lat: 17.5710, lng: 121.8250, name: "Aparri, Cagayan",                   hint: "Northernmost town of Luzon" },
  { lat: 16.7290, lng: 121.5520, name: "Santiago City, Isabela",            hint: "Bamboo capital of Cagayan Valley" },

  // === LUZON - CENTRAL LUZON ===
  { lat: 15.4755, lng: 120.5960, name: "San Fernando, Pampanga",            hint: "Christmas capital of the PH" },
  { lat: 15.1450, lng: 120.5880, name: "Angeles City, Pampanga",            hint: "Near Clark Freeport Zone" },
  { lat: 15.0794, lng: 120.6200, name: "Clark, Pampanga",                   hint: "Former US Air Force base" },
  { lat: 14.8527, lng: 120.8170, name: "Malolos, Bulacan",                  hint: "First Philippine Republic capital" },
  { lat: 14.8600, lng: 120.8100, name: "Malolos Cathedral, Bulacan",        hint: "Historic Barasoain Church area" },
  { lat: 15.1570, lng: 120.7740, name: "Cabanatuan City, Nueva Ecija",      hint: "Rice capital of the Philippines" },
  { lat: 15.5790, lng: 120.9640, name: "Palayan City, Nueva Ecija",         hint: "Capital of Nueva Ecija" },
  { lat: 15.7260, lng: 120.5680, name: "Tarlac City",                       hint: "Gateway to Central Luzon" },
  { lat: 15.4550, lng: 119.9830, name: "Iba, Zambales",                     hint: "Capital of Zambales" },
  { lat: 14.8270, lng: 119.9500, name: "Olongapo City, Zambales",           hint: "Gateway to Subic Bay" },
  { lat: 14.7940, lng: 120.2720, name: "Balanga City, Bataan",              hint: "Capital of Bataan province" },
  { lat: 14.5170, lng: 120.6900, name: "Bataan Death March marker",         hint: "WWII historic site" },

  // === METRO MANILA OUTSKIRTS - RIZAL / CAVITE / LAGUNA ===
  { lat: 14.1020, lng: 121.2110, name: "Antipolo City, Rizal",              hint: "City of Pilgrimage and Art" },
  { lat: 14.3294, lng: 121.0767, name: "Calamba, Laguna",                   hint: "Birthplace of Jose Rizal" },
  { lat: 14.1631, lng: 121.2430, name: "Santa Cruz, Laguna",                hint: "Laguna's provincial capital" },
  { lat: 14.0796, lng: 121.3270, name: "Pagsanjan, Laguna",                 hint: "Famous canyon and falls" },
  { lat: 14.3530, lng: 121.1610, name: "Los Baños, Laguna",                 hint: "Hot springs and UPLB campus" },
  { lat: 14.2780, lng: 121.4150, name: "Lucban, Quezon",                    hint: "Pahiyas Festival town" },
  { lat: 14.3450, lng: 120.9390, name: "Cavite City",                       hint: "Cradle of Philippine Revolution" },
  { lat: 14.2830, lng: 120.8622, name: "Bacoor, Cavite",                    hint: "Southern commuter city" },
  { lat: 14.1880, lng: 120.8910, name: "Imus, Cavite",                      hint: "Gateway city of Cavite" },
  { lat: 14.0760, lng: 121.0480, name: "Dasmariñas, Cavite",                hint: "Fastest-growing Cavite city" },
  { lat: 14.1060, lng: 120.7760, name: "General Trias, Cavite",             hint: "Booming city of Cavite" },
  { lat: 14.0980, lng: 120.6490, name: "Naic, Cavite",                      hint: "Old town of Cavite" },
  { lat: 13.6390, lng: 120.9260, name: "Nasugbu, Batangas",                 hint: "Beach resort of Batangas" },
  { lat: 13.7565, lng: 121.0614, name: "Batangas City",                     hint: "Petrochemical and port city" },
  { lat: 13.9456, lng: 120.9283, name: "Taal Town, Batangas",               hint: "Heritage town near the volcano" },
  { lat: 13.6985, lng: 120.9001, name: "Anilao, Batangas",                  hint: "Diving capital of the Philippines" },
  { lat: 13.7820, lng: 121.2100, name: "Lipa City, Batangas",               hint: "Coffee capital of Batangas" },
  { lat: 13.9520, lng: 121.1650, name: "Santo Tomas, Batangas",             hint: "Batangas' fastest-growing city" },

  // === LUZON - QUEZON / BICOL ===
  { lat: 13.9473, lng: 121.6174, name: "Lucena City, Quezon",               hint: "Gateway to Bicol" },
  { lat: 14.0727, lng: 121.4789, name: "Tayabas, Quezon",                   hint: "Heritage city of Quezon" },
  { lat: 13.8070, lng: 121.6950, name: "Infanta, Quezon",                   hint: "Eco-tourism gateway of Quezon" },
  { lat: 13.1391, lng: 123.7438, name: "Naga City, Camarines Sur",          hint: "Heart of Bicol Region" },
  { lat: 13.6193, lng: 123.1944, name: "Legazpi City, Albay",               hint: "Under the shadow of Mayon" },
  { lat: 13.6530, lng: 123.2150, name: "Legazpi Port, Albay",               hint: "Mayon Volcano backdrop views" },
  { lat: 13.2543, lng: 123.6853, name: "Pili, Camarines Sur",               hint: "Provincial capital of CamSur" },
  { lat: 12.3657, lng: 124.0436, name: "Sorsogon City",                     hint: "Where whale sharks roam" },
  { lat: 14.0830, lng: 122.9555, name: "Daet, Camarines Norte",             hint: "Home of ten martyrs of Camarines" },
  { lat: 13.4276, lng: 123.4147, name: "Virac, Catanduanes",                hint: "Capital of Catanduanes" },
  { lat: 12.8780, lng: 124.2980, name: "Masbate City",                      hint: "Rodeo capital of the Philippines" },
  { lat: 13.0800, lng: 123.9600, name: "Bulan, Sorsogon",                   hint: "Southern tip of Sorsogon" },

  // === LUZON - MIMAROPA ===
  { lat: 12.3657, lng: 121.9033, name: "Calapan City, Oriental Mindoro",    hint: "Capital of Oriental Mindoro" },
  { lat: 13.5200, lng: 121.1980, name: "Mamburao, Occidental Mindoro",      hint: "Capital of Occidental Mindoro" },
  { lat: 9.8349,  lng: 118.7384, name: "Puerto Princesa, Palawan",          hint: "City in a forest" },
  { lat: 9.7454,  lng: 118.7349, name: "Robinsons Place, Puerto Princesa",  hint: "Main mall of Palawan" },
  { lat: 10.1677, lng: 119.4063, name: "El Nido Town, Palawan",             hint: "Island hopping paradise" },
  { lat: 11.9984, lng: 119.9236, name: "Coron Town, Palawan",               hint: "Pristine island paradise" },
  { lat: 13.4138, lng: 122.5622, name: "Romblon Town, Romblon",             hint: "Marble capital of the Philippines" },
  { lat: 12.5760, lng: 122.0780, name: "San Jose, Occidental Mindoro",      hint: "Western Mindoro's main city" },

  // === VISAYAS - CEBU ===
  { lat: 10.2934, lng: 123.9022, name: "Magellan's Cross, Cebu City",       hint: "Heart of Cebu" },
  { lat: 10.3157, lng: 123.8854, name: "Cebu City Downtown",                hint: "Queen City of the South" },
  { lat: 10.3111, lng: 123.9130, name: "IT Park, Cebu City",                hint: "Cebu's BPO and nightlife hub" },
  { lat: 10.2899, lng: 123.8528, name: "SM Seaside, Cebu City",             hint: "Coastal mall with mountain views" },
  { lat: 10.3190, lng: 123.9050, name: "Ayala Center Cebu",                 hint: "Premier mall of Cebu" },
  { lat: 10.2930, lng: 123.8820, name: "Fuente Osmeña, Cebu City",          hint: "Cebu City's iconic roundabout" },
  { lat: 10.0393, lng: 123.8545, name: "Carcar City, Cebu",                 hint: "Heritage city of lechon and chicharon" },
  { lat: 10.6419, lng: 123.8530, name: "Danao City, Cebu",                  hint: "Industrial city north of Cebu" },
  { lat: 10.8440, lng: 124.0140, name: "Bogo City, Cebu",                   hint: "Northern tip of Cebu island" },
  { lat: 10.2640, lng: 123.8190, name: "Talisay City, Cebu",                hint: "Southern neighbor of Cebu City" },
  { lat: 10.1695, lng: 123.7040, name: "Minglanilla, Cebu",                 hint: "Fast-growing south Cebu town" },
  { lat: 10.3440, lng: 123.9110, name: "Mandaue City, Cebu",                hint: "Industrial city of Metro Cebu" },
  { lat: 10.3560, lng: 123.9600, name: "Lapu-Lapu City, Cebu",              hint: "Where Magellan fell" },
  { lat: 10.3600, lng: 123.9720, name: "Mactan-Cebu Airport area",          hint: "Cebu's international gateway" },
  { lat: 9.8390,  lng: 123.4260, name: "Toledo City, Cebu",                 hint: "Mining city on Cebu's west coast" },
  { lat: 9.6459,  lng: 123.3440, name: "San Fernando, Cebu",                hint: "Southern Cebu town" },
  { lat: 9.5140,  lng: 123.4060, name: "Dumanjug, Cebu",                    hint: "Far south Cebu coastal town" },

  // === VISAYAS - BOHOL ===
  { lat: 9.7996,  lng: 124.1694, name: "Chocolate Hills, Bohol",            hint: "Famous geological formation" },
  { lat: 9.6560,  lng: 123.8754, name: "Tagbilaran City, Bohol",            hint: "Capital of Bohol province" },
  { lat: 9.7303,  lng: 124.2429, name: "Loboc River, Bohol",                hint: "Famous river cruise destination" },
  { lat: 9.7380,  lng: 123.8870, name: "Baclayon Church, Bohol",            hint: "One of the oldest churches in PH" },
  { lat: 9.7490,  lng: 124.0270, name: "Carmen, Bohol",                     hint: "Gateway to Chocolate Hills" },
  { lat: 9.8250,  lng: 124.4440, name: "Talibon, Bohol",                    hint: "Northern Bohol gateway" },
  { lat: 9.5940,  lng: 124.3710, name: "Jagna, Bohol",                      hint: "Gateway to Eastern Bohol" },

  // === VISAYAS - ILOILO / WESTERN VISAYAS ===
  { lat: 10.7202, lng: 122.5621, name: "Iloilo City Esplanade",             hint: "Scenic waterfront promenade" },
  { lat: 11.1636, lng: 123.1990, name: "Iloilo City Proper",                hint: "City of Love" },
  { lat: 10.7081, lng: 122.5621, name: "SM City Iloilo",                    hint: "Major mall in Western Visayas" },
  { lat: 10.5929, lng: 122.6210, name: "Miagao Church, Iloilo",             hint: "UNESCO Baroque church" },
  { lat: 10.9650, lng: 122.5760, name: "Pototan, Iloilo",                   hint: "Sugarcane town of Iloilo" },
  { lat: 10.6780, lng: 122.5390, name: "San Joaquin Church, Iloilo",        hint: "Fortress-like heritage church" },
  { lat: 11.7030, lng: 122.5500, name: "Roxas City, Capiz",                 hint: "Seafood capital of the Philippines" },
  { lat: 11.1640, lng: 122.4750, name: "Passi City, Iloilo",                hint: "Iloilo's northern heartland" },
  { lat: 10.8870, lng: 123.0190, name: "Guimaras Island, Western Visayas",  hint: "Mango capital of the Philippines" },
  { lat: 11.5897, lng: 122.9785, name: "Bacolod City, Neg. Occidental",     hint: "City of Smiles, MassKara Festival" },
  { lat: 11.6700, lng: 122.9543, name: "SM City Bacolod",                   hint: "Northern Bacolod commercial area" },
  { lat: 10.4990, lng: 123.0120, name: "Kabankalan City, Neg. Occidental",  hint: "Sugar city of Negros" },
  { lat: 10.6700, lng: 123.0160, name: "Victorias City, Neg. Occidental",   hint: "Sugar central of Negros" },
  { lat: 10.3200, lng: 123.1380, name: "Silay City, Neg. Occidental",       hint: "Paris of Negros" },
  { lat: 9.9820,  lng: 122.5620, name: "San Carlos City, Neg. Occidental",  hint: "Gateway to Cebu via ferry" },
  { lat: 8.2280,  lng: 124.2450, name: "Dumaguete City, Neg. Oriental",     hint: "City of Gentle People" },
  { lat: 8.2302,  lng: 124.2553, name: "Silliman University, Dumaguete",    hint: "First American university in Asia" },
  { lat: 9.3000,  lng: 123.3040, name: "Bais City, Neg. Oriental",          hint: "Dolphin watching capital" },
  { lat: 9.1800,  lng: 123.1700, name: "Bayawan City, Neg. Oriental",       hint: "Ecological city of Negros Oriental" },

  // === VISAYAS - SAMAR / LEYTE ===
  { lat: 11.2442, lng: 125.0039, name: "Tacloban City, Leyte",              hint: "Capital of Eastern Visayas" },
  { lat: 11.2508, lng: 124.9940, name: "Leyte Provincial Capitol",          hint: "Tacloban's government center" },
  { lat: 11.0427, lng: 124.6145, name: "Ormoc City, Leyte",                 hint: "Sugar and power city of Leyte" },
  { lat: 10.8910, lng: 124.4680, name: "Baybay City, Leyte",                hint: "Leyte's western coastal city" },
  { lat: 10.7420, lng: 124.8000, name: "Maasin City, Southern Leyte",       hint: "Capital of Southern Leyte" },
  { lat: 11.2420, lng: 124.0000, name: "Catbalogan City, Samar",            hint: "Capital of Western Samar" },
  { lat: 11.5650, lng: 125.0040, name: "Calbayog City, Samar",              hint: "City of waterfalls in Samar" },
  { lat: 12.0040, lng: 125.0082, name: "Borongan City, Eastern Samar",      hint: "Eastern Samar's capital" },
  { lat: 11.6820, lng: 124.8260, name: "Catarman, Northern Samar",          hint: "Capital of Northern Samar" },
  { lat: 10.5770, lng: 125.2900, name: "Liloan, Southern Leyte",            hint: "Whale shark country in Southern Leyte" },

  // === VISAYAS - AKLAN / ANTIQUE / CAPIZ ===
  { lat: 11.8214, lng: 122.0923, name: "Kalibo, Aklan",                     hint: "Ati-Atihan Festival town" },
  { lat: 11.9280, lng: 121.9270, name: "Caticlan, Aklan",                   hint: "Gateway to Boracay" },
  { lat: 11.9615, lng: 121.9281, name: "Boracay Island, Aklan",             hint: "World-famous beach island" },
  { lat: 11.3640, lng: 121.9270, name: "San Jose, Antique",                 hint: "Capital of Antique province" },
  { lat: 11.5580, lng: 121.9430, name: "Culasi, Antique",                   hint: "Gateway to Malalison Island" },

  // === VISAYAS - BILIRAN / CEBU NORTH ===
  { lat: 11.5800, lng: 124.3650, name: "Naval, Biliran",                    hint: "Capital of Biliran island" },

  // === MINDANAO - DAVAO REGION ===
  { lat: 7.0731,  lng: 125.6128, name: "Davao City Proper",                 hint: "Largest city by land area" },
  { lat: 7.0712,  lng: 125.6070, name: "SM Lanang, Davao",                  hint: "Premier mall of Davao" },
  { lat: 7.0590,  lng: 125.5950, name: "Ateneo de Davao, Davao City",       hint: "Davao's Jesuit university" },
  { lat: 7.0860,  lng: 125.5930, name: "Bangkerohan Market, Davao",         hint: "Davao's main public market" },
  { lat: 7.1907,  lng: 125.4553, name: "Toril, Davao City",                 hint: "Southern Davao coastal area" },
  { lat: 7.3041,  lng: 125.6839, name: "Tagum City, Davao del Norte",       hint: "Banana capital of the Philippines" },
  { lat: 6.8022,  lng: 125.6090, name: "Digos City, Davao del Sur",         hint: "Capital of Davao del Sur" },
  { lat: 6.6430,  lng: 125.3590, name: "Kidapawan City, North Cotabato",    hint: "Gateway to Mt. Apo" },
  { lat: 7.5310,  lng: 125.8000, name: "Mati City, Davao Oriental",         hint: "Easternmost city in Mindanao" },
  { lat: 6.7390,  lng: 125.3580, name: "Makilala, North Cotabato",          hint: "Town near Mt. Apo base" },
  { lat: 6.1164,  lng: 125.1716, name: "General Santos City",               hint: "Tuna capital of the Philippines" },
  { lat: 6.1100,  lng: 125.1800, name: "Gensan Fish Port Complex",          hint: "World-class tuna port" },
  { lat: 6.0650,  lng: 125.1050, name: "Koronadal City, South Cotabato",    hint: "Capital of South Cotabato" },
  { lat: 6.5170,  lng: 124.8430, name: "Tacurong City, Sultan Kudarat",     hint: "Commercial city of Sultan Kudarat" },
  { lat: 9.8494,  lng: 125.5380, name: "Siargao Island, Surigao del Norte", hint: "Surfing capital of the Philippines" },
  { lat: 9.8550,  lng: 126.0470, name: "General Luna, Siargao",             hint: "Cloud 9 surf spot" },

  // === MINDANAO - DAVAO CITY NEIGHBORHOODS ===
  { lat: 7.0600,  lng: 125.6120, name: "Ecoland, Davao City",               hint: "Business district of Davao" },
  { lat: 7.0740,  lng: 125.6200, name: "Magsaysay Park, Davao",             hint: "Davao's baywalk and park" },
  { lat: 7.0780,  lng: 125.6100, name: "Agdao, Davao City",                 hint: "Central Davao community" },

  // === MINDANAO - NORTHERN MINDANAO ===
  { lat: 8.4542,  lng: 124.6319, name: "Cagayan de Oro Proper",             hint: "City of Golden Friendship" },
  { lat: 8.4800,  lng: 124.6480, name: "Divisoria, CDO",                    hint: "Cagayan de Oro's market district" },
  { lat: 8.4890,  lng: 124.6520, name: "Limketkai Mall, CDO",               hint: "Premier mall of CDO" },
  { lat: 8.4760,  lng: 124.5630, name: "Xavier University, CDO",            hint: "Ateneo de Cagayan" },
  { lat: 8.1590,  lng: 124.2318, name: "Iligan City, Lanao del Norte",      hint: "City of Majestic Waterfalls" },
  { lat: 7.8742,  lng: 123.5052, name: "Ozamiz City, Misamis Occidental",   hint: "Gateway to Western Mindanao" },
  { lat: 8.1590,  lng: 123.8460, name: "Oroquieta City, Misamis Occidental",hint: "City of good life in Mindanao" },
  { lat: 8.5180,  lng: 124.6550, name: "El Salvador, Misamis Oriental",     hint: "Coastal town east of CDO" },
  { lat: 8.6000,  lng: 124.7450, name: "Gingoog City, Misamis Oriental",    hint: "Eastern Misamis Oriental city" },
  { lat: 9.0480,  lng: 125.5290, name: "Butuan City, Agusan del Norte",     hint: "Timber and rafting capital" },
  { lat: 8.9470,  lng: 125.3920, name: "Cabadbaran City, Agusan del Norte", hint: "Capital of Agusan del Norte" },
  { lat: 8.9500,  lng: 125.8200, name: "Bayugan City, Agusan del Sur",      hint: "Agroforestry city of Mindanao" },

  // === MINDANAO - ZAMBOANGA PENINSULA ===
  { lat: 6.9214,  lng: 122.0790, name: "Zamboanga City Proper",             hint: "Asia's Latin City" },
  { lat: 6.9100,  lng: 122.0730, name: "Rio Hondo, Zamboanga",              hint: "Water village of Zamboanga" },
  { lat: 6.9300,  lng: 122.0860, name: "Cawa-Cawa Boulevard, Zamboanga",    hint: "Scenic baywalk of Zamboanga" },
  { lat: 7.8316,  lng: 123.4315, name: "Pagadian City, Zamboanga del Sur",  hint: "Little Hong Kong of the South" },
  { lat: 7.1530,  lng: 122.6970, name: "Diplahan, Zamboanga Sibugay",       hint: "Rubber capital of Zamboanga" },
  { lat: 7.8230,  lng: 123.0340, name: "Ipil, Zamboanga Sibugay",           hint: "Capital of Zamboanga Sibugay" },

  // === MINDANAO - SOCCSKSARGEN / BANGSAMORO ===
  { lat: 7.3047,  lng: 124.8703, name: "Cotabato City",                     hint: "Islamic City of the Philippines" },
  { lat: 6.9560,  lng: 124.2870, name: "Kakar, Maguindanao",                hint: "BARMM heartland" },
  { lat: 7.3060,  lng: 124.2460, name: "Kabacan, North Cotabato",           hint: "Corn capital of Mindanao" },
  { lat: 6.7070,  lng: 124.2280, name: "Mlang, North Cotabato",             hint: "Agricultural town of North Cotabato" },

  // === MINDANAO - CARAGA ===
  { lat: 9.9955,  lng: 125.5930, name: "Surigao City",                      hint: "Gateway to Siargao" },
  { lat: 10.0510, lng: 125.5850, name: "Surigao City Port",                 hint: "Main ferry terminal of Surigao" },
  { lat: 9.7620,  lng: 125.4660, name: "Tandag City, Surigao del Sur",      hint: "Capital of Surigao del Sur" },
  { lat: 8.7070,  lng: 126.0720, name: "Bislig City, Surigao del Sur",      hint: "Eco-tourism city in Surigao Sur" },

  // === MINDANAO - LANAO DEL SUR ===
  { lat: 7.9040,  lng: 124.2890, name: "Marawi City, Lanao del Sur",        hint: "Islamic City of Mindanao" },
  { lat: 7.9100,  lng: 124.3050, name: "Lake Lanao, Lanao del Sur",         hint: "Largest lake in Mindanao" },

  // === PALAWAN ===
  { lat: 9.7350,  lng: 118.7340, name: "Puerto Princesa City Plaza",        hint: "Heart of Palawan's capital" },
  { lat: 9.7200,  lng: 118.7600, name: "Honda Bay, Palawan",                hint: "Island hopping near Puerto Princesa" },
  { lat: 10.1820, lng: 119.4180, name: "El Nido Poblacion, Palawan",        hint: "Jumping off point for island tours" },
  { lat: 11.9630, lng: 119.8960, name: "Coron Town Proper, Palawan",        hint: "Wreck diving capital" },

  // === ADDITIONAL NOTABLE SPOTS ===
  { lat: 14.5820, lng: 121.0470, name: "Bonifacio High Street, BGC",        hint: "Open-air commercial strip" },
  { lat: 14.5510, lng: 121.0490, name: "Market! Market! BGC",               hint: "Taguig's lifestyle mall" },
  { lat: 14.6060, lng: 121.0340, name: "Annapolis St, Greenhills",          hint: "Tiangge and shopping mecca" },
  { lat: 14.5580, lng: 121.0590, name: "Guadalupe, Makati",                 hint: "Makati's commercial barangay" },
  { lat: 14.5480, lng: 121.0590, name: "Comembo, Makati",                   hint: "Quiet residential Makati area" },
  { lat: 14.5630, lng: 120.9990, name: "Harrison Plaza, Malate",            hint: "Old-school Malate mall area" },
  { lat: 10.7600, lng: 122.5640, name: "Jaro, Iloilo City",                 hint: "Iloilo's heritage district" },
  { lat: 10.7300, lng: 122.5490, name: "Molo Church, Iloilo",               hint: "Feminist church of the Philippines" },
  { lat: 10.6960, lng: 122.5600, name: "Oton, Iloilo",                      hint: "First capital of Iloilo" },
  { lat: 11.0440, lng: 124.5500, name: "Palo, Leyte",                       hint: "MacArthur landing site" },
  { lat: 11.2440, lng: 124.9830, name: "SM City Tacloban",                  hint: "Largest mall in Eastern Visayas" },
  { lat: 7.0660,  lng: 125.5900, name: "University of Mindanao, Davao",     hint: "Davao's largest university" },
  { lat: 7.0970,  lng: 125.6000, name: "Agdao Market, Davao",               hint: "Davao's wet market hub" },
  { lat: 8.5090,  lng: 124.6460, name: "Pueblo de Oro, CDO",                hint: "Upscale CDO township" },
  { lat: 14.6570, lng: 121.1050, name: "Marikina River Park",               hint: "Shoe-making city's riverfront" },
  { lat: 14.5350, lng: 121.0810, name: "FTI, Taguig",                       hint: "Taguig's food and industrial area" },
  { lat: 14.5270, lng: 121.0030, name: "SM Mall of Asia, Pasay",            hint: "One of the world's largest malls" },
  { lat: 14.5540, lng: 120.9830, name: "Roxas Boulevard, Manila",           hint: "Manila's famous baywalk" },
  { lat: 14.5490, lng: 120.9690, name: "Manila Bay sunset area",            hint: "Iconic sunset spot of Manila" },
  { lat: 16.4000, lng: 120.5980, name: "Baguio Public Market",              hint: "Freshest produce in the highlands" },
  { lat: 13.6214, lng: 123.2020, name: "Legazpi City Lignon Hill",          hint: "Mayon Volcano viewpoint" },
  { lat: 13.1300, lng: 123.7480, name: "Naga City Metropolitan Cathedral",  hint: "Heart of Catholic Bicol" },
  { lat: 12.3710, lng: 124.0490, name: "Sorsogon Rizal Boulevard",          hint: "Scenic baywalk of Sorsogon" },
  { lat: 9.6000,  lng: 123.8650, name: "Alona Beach, Bohol",                hint: "Popular dive and beach spot" },
  { lat: 9.9120,  lng: 124.1600, name: "Tubigon, Bohol",                    hint: "Bohol's northern ferry port" },
  { lat: 11.1440, lng: 122.0120, name: "Kalibo Airport area, Aklan",        hint: "Main airport for Boracay access" },
  { lat: 11.5940, lng: 122.9820, name: "Lacson Street, Bacolod",            hint: "Bacolod's main commercial street" },
  { lat: 10.2980, lng: 123.9060, name: "Colon Street, Cebu City",           hint: "Oldest street in the Philippines" },
  { lat: 10.3080, lng: 123.9070, name: "Carbon Market, Cebu City",          hint: "Cebu's largest public market" },
  { lat: 10.3570, lng: 123.9620, name: "Lapu-Lapu Shrine, Mactan",          hint: "Monument to the chieftain hero" },
  { lat: 7.2073,  lng: 125.9793, name: "Mati City Proper, Davao Oriental",  hint: "Pacific-facing Mindanao city" },
  { lat: 6.0540,  lng: 125.1180, name: "Koronadal City Hall, South Cotabato",hint: "Heart of South Cotabato" },
  { lat: 9.0490,  lng: 125.5350, name: "Butuan City Hall",                  hint: "Home of the Balanghai boats" },
  { lat: 9.0600,  lng: 125.5200, name: "Robinsons Place Butuan",            hint: "Main mall of Caraga region" },
  { lat: 6.9260,  lng: 122.0820, name: "Zamboanga City Hall",               hint: "Colorful vinta boat city" },
  { lat: 15.7290, lng: 120.5720, name: "Tarlac City Hall",                  hint: "Center of Central Luzon" },
  { lat: 15.1530, lng: 120.5870, name: "SM Clark, Pampanga",                hint: "Mall inside the old US base" },
  { lat: 14.8520, lng: 120.8180, name: "Barasoain Church, Malolos",         hint: "Birth of the 1899 constitution" },
  { lat: 14.0740, lng: 121.3300, name: "Pagsanjan Landing, Laguna",         hint: "Start of the famous boat ride" },
  { lat: 13.9890, lng: 121.5620, name: "Real, Quezon",                      hint: "Surf town on Quezon's Pacific coast" },
  { lat: 14.2040, lng: 121.1460, name: "Biñan City Hall, Laguna",           hint: "Birthplace of Jose Rizal's father" },
  { lat: 13.7710, lng: 121.0560, name: "Lipa City Cathedral, Batangas",     hint: "Shrine of Our Lady of Caysasay" },
  { lat: 15.4820, lng: 119.9600, name: "Subic Bay, Zambales",               hint: "Former US Navy base turned freeport" },
  { lat: 14.7960, lng: 120.2790, name: "Bataan National Hospital area",     hint: "Historic Bataan provincial center" },
  { lat: 16.4820, lng: 121.1490, name: "Bambang, Nueva Vizcaya",            hint: "Capital of Nueva Vizcaya" },
  { lat: 16.9270, lng: 121.7770, name: "Tuguegarao Cathedral, Cagayan",     hint: "Baroque church in Cagayan" },
  { lat: 18.0110, lng: 120.5590, name: "Burgos, Ilocos Norte",              hint: "Near the windmill farms" },
  { lat: 17.1110, lng: 120.3540, name: "Candon City, Ilocos Sur",           hint: "Tobacco city of Ilocos" },
  { lat: 16.6870, lng: 120.3620, name: "Santa, Ilocos Sur",                 hint: "Ilocos heritage coastal town" },
  { lat: 16.9930, lng: 120.5600, name: "Agoo, La Union",                    hint: "Shrine of Our Lady of Charity" },
  { lat: 16.7680, lng: 120.4050, name: "Bauang, La Union",                  hint: "Beach resort town of La Union" },
  { lat: 16.6580, lng: 120.4180, name: "San Fernando City La Union Proper", hint: "Surfing hub of the north" },
  { lat: 17.1440, lng: 121.4720, name: "Solano, Nueva Vizcaya",             hint: "Gateway to Cagayan Valley" },
  { lat: 10.5550, lng: 124.0090, name: "Argao, Cebu",                       hint: "Southern Cebu heritage town" },
  { lat: 10.4270, lng: 123.9650, name: "Naga, Cebu",                        hint: "Southern suburb of Cebu" },
  { lat: 11.0090, lng: 124.6070, name: "Babatngon, Leyte",                  hint: "Northern Leyte coastal town" },
  { lat: 10.6630, lng: 124.9940, name: "Abuyog, Leyte",                     hint: "Eastern Leyte coastal town" },
  { lat: 11.8010, lng: 125.0230, name: "Laoang, Northern Samar",            hint: "Island town of Northern Samar" },
  { lat: 12.0580, lng: 124.5970, name: "Catarman Airport area, N. Samar",   hint: "Northern Samar aviation gateway" },
  { lat: 10.8280, lng: 124.9790, name: "Tanauan, Leyte",                    hint: "Near the MacArthur landing monument" },
  { lat: 9.2780,  lng: 123.2660, name: "La Libertad, Neg. Oriental",        hint: "Northern Neg. Oriental town" },
  { lat: 9.0680,  lng: 123.3490, name: "Guihulngan City, Neg. Oriental",    hint: "City in Northern Negros Oriental" },
  { lat: 10.0310, lng: 123.0200, name: "Escalante City, Neg. Occidental",   hint: "Sugar city of northern Negros" },
  { lat: 11.2560, lng: 123.7040, name: "Ormoc Airport area",                hint: "Leyte's secondary air gateway" },
  { lat: 8.5270,  lng: 124.3690, name: "Jasaan, Misamis Oriental",          hint: "Eco-tourism town of Mis. Or." },
  { lat: 8.6800,  lng: 124.7340, name: "Medina, Misamis Oriental",          hint: "Coastal town of Misamis Oriental" },
  { lat: 7.9100,  lng: 123.4310, name: "Jimenez, Misamis Occidental",       hint: "Northern Misamis Occ. town" },
  { lat: 7.6590,  lng: 123.4920, name: "Oroquieta proper area",             hint: "Fruit orchard country" },
  { lat: 7.7180,  lng: 123.8490, name: "Tangub City, Misamis Occidental",   hint: "City of Springs" },
  { lat: 7.6430,  lng: 126.0890, name: "Compostela Valley, Davao de Oro",   hint: "Mining and banana country" },
  { lat: 7.8680,  lng: 126.0510, name: "Monkayo, Davao de Oro",             hint: "Davao de Oro's commercial hub" },
  { lat: 5.8850,  lng: 125.3640, name: "Sarangani Province, General Santos area", hint: "Southernmost province of PH" },
  { lat: 6.0620,  lng: 124.6950, name: "Surallah, South Cotabato",          hint: "Agricultural town of South Cotabato" },
  { lat: 6.9780,  lng: 122.5830, name: "Dipolog City, Zamboanga del Norte", hint: "Gateway to Zamboanga del Norte" },
  { lat: 8.2300,  lng: 123.3960, name: "Dapitan City, Zamboanga del Norte", hint: "Rizal's place of exile" },
  { lat: 7.5400,  lng: 122.7180, name: "Sindangan, Zamboanga del Norte",    hint: "Coastal town of Zamboanga Norte" },
  { lat: 7.1600,  lng: 122.6370, name: "Liloy, Zamboanga del Norte",        hint: "Small town on Zamboanga Norte coast" },
  { lat: 6.8700,  lng: 122.5640, name: "Siocon, Zamboanga del Norte",       hint: "Border town of Zamboanga Norte" },
  { lat: 10.0500, lng: 118.7550, name: "Brooke's Point, Palawan",           hint: "Southern Palawan town" },
  { lat: 10.6300, lng: 119.4000, name: "Taytay, Palawan",                   hint: "Historical town of northern Palawan" },
  { lat: 11.1530, lng: 119.3980, name: "Roxas, Palawan",                    hint: "Northern Palawan town" },
  { lat: 12.1840, lng: 119.7200, name: "Culion, Palawan",                   hint: "Former leper colony island" },
  { lat: 10.0810, lng: 118.7320, name: "Narra, Palawan",                    hint: "Rice and eco-tourism in south Palawan" },
]

export function getRandomLocations(count = 5, exclude = []) {
  const available = LOCATIONS.filter(l => !exclude.includes(l))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Seeded random — same output for the same seed every time
function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

// Returns the same 5 locations for everyone on the same calendar day (PH time)
export function getDailyLocations(count = 5) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
  const rand = seededRandom(seed)
  const shuffled = [...LOCATIONS].sort(() => rand() - 0.5)
  return shuffled.slice(0, count)
}
