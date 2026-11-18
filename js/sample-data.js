// Sample data for building and demoing the front end before the API exists.
// Every organiser and student here is made up. Places are real public places.
// Dates are relative to today, so the demo always looks current.
(function () {
  const day = (offset, hhmm) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    const [h, m] = hhmm.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  // [id, area, title, organiser, place, dayOffset, start, end, spots, taken,
  //  deadline [dayOffset, time] or null (= day before at 23:59), friends, description]
  const rows = [
    ["a01", "HL", "Badminton social", "RP Badminton Club", "RP Sports Hall", 0, "17:00", "19:00", 24, 21, [0, "16:00"],
      ["Marcus", "Priya"], "Casual doubles on six courts. Rackets and shuttles provided; bring non-marking shoes. All levels, and you'll be rotated so you play with new people."],
    ["a02", "OA", "Chek Jawa intertidal walk", "Ubin Shore Guides", "Pulau Ubin", 1, "08:00", "11:00", 20, 14, [0, "23:59"],
      ["Aisyah", "Wei Ling", "Daniel"], "A guided low-tide walk along the Chek Jawa boardwalk and shore, looking for sea stars, crabs and seagrass. Meet at Changi Point Ferry Terminal at 07:30. Wear shoes that can get wet."],
    ["a17", "HL", "Futsal night", "RP Futsal Club", "RP Sports Hall", 2, "19:00", "21:00", 20, 12, [0, "00:01"],
      ["Daniel"], "Five-a-side games with rotating teams. Sign-up has closed because teams are drawn the day before."],
    ["a03", "SL", "Harvest morning at a community farm", "Kampong Grow Collective", "Lim Chu Kang", 2, "09:00", "12:00", 15, 9, null,
      ["Hui Min"], "Help harvest and wash greens, then pack them for a weekly delivery to families in Choa Chu Kang. Gloves provided. Transport from Kranji MRT at 08:30."],
    ["a04", "SL", "Food pack night", "Northside Food Share", "Woodlands Community Club", 3, "18:30", "21:00", 30, 30, null,
      ["Marcus", "Aisyah"], "Sort donated groceries and pack 150 bundles for households in Woodlands. Fast, cheerful and good with a group of friends."],
    ["a05", "HL", "Sunrise run along the waterfront", "RP Running Club", "Woodlands Waterfront Park", 4, "07:30", "09:00", 40, 12, null,
      [], "An easy 5 km at conversation pace, with a faster group for anyone who wants it. Ends with breakfast at the jetty."],
    ["a06", "CL", "Plan a block party with residents", "Marsiling Youth Network", "Marsiling Drive", 5, "14:00", "17:00", 8, 5, [3, "23:59"],
      ["Priya"], "Work with residents and the RC to plan a void-deck party for December: budget, games, food and a sign-up drive. You'll own one part of the plan."],
    ["a07", "OA", "Kayaking through the mangroves", "Paddle North", "Pasir Ris Park", 6, "09:00", "13:00", 12, 10, null,
      ["Daniel", "Wei Ling"], "A beginner-friendly paddle along Sungei Api Api with a safety briefing on land first. You must be able to swim 50 m. Kayaks and life jackets provided."],
    ["a08", "SL", "Reading buddies for P3 pupils", "Library Buddies SG", "Woodlands Regional Library", 8, "10:00", "12:00", 10, 4, null,
      [], "Read with a pair of Primary 3 pupils who are building confidence in English. A short training session runs before the first visit."],
    ["a09", "HL", "Rock climbing taster", "RP Outdoor Club", "RP Sports Complex climbing wall", 9, "19:00", "20:30", 16, 7, null,
      ["Hui Min", "Marcus"], "Learn to tie in, belay and climb your first routes with club instructors. Harness and shoes provided."],
    ["a10", "CL", "Lead an orientation station", "RP Student Life", "RP Lecture Theatre 1", 11, "15:00", "18:00", 20, 8, null,
      [], "Training for station leaders at next term's orientation. You'll design and run one 15-minute game for a group of first-years."],
    ["a11", "OA", "MacRitchie TreeTop Walk hike", "RP Outdoor Club", "MacRitchie Reservoir Park", 13, "08:00", "12:00", 25, 6, null,
      ["Aisyah"], "An 11 km loop through the forest and across the TreeTop Walk suspension bridge. Bring 1.5 litres of water."],
    ["a12", "SL", "Beach clean-up at Sembawang Park", "Shoreline Keepers", "Sembawang Park", 15, "09:00", "12:00", 50, 18, null,
      ["Wei Ling", "Daniel", "Priya", "Hui Min"], "Collect and sort litter along the shore and record what you find for a national beach survey. Gloves, bags and tongs provided."],
    ["a13", "CL", "Run a games booth at a seniors' carnival", "Yishun Active Ageing Centre", "Yishun", 18, "13:00", "17:00", 12, 3, null,
      [], "Design and run a games booth with a small team for about 200 seniors. You'll plan the game, the prizes and the rota."],
    ["a14", "HL", "Yoga on the lawn", "RP Wellness", "RP Central Lawn", 21, "18:00", "19:30", 30, 9, null,
      [], "A gentle evening class for all levels. Mats provided. Moved indoors to the Sports Hall if it rains."],
    ["a15", "OA", "Coney Island cycling loop", "Paddle North", "Coney Island Park", 24, "08:30", "11:30", 20, 4, null,
      [], "A flat 10 km ride through the island's casuarina forest and beaches. Bike rental arranged; helmets provided."],
    ["a16", "SL", "Thrift sorting day", "Second Round Thrift", "Bukit Panjang", 28, "10:00", "14:00", 15, 2, null,
      [], "Sort and price donated clothes for a charity thrift sale. Proceeds go to a youth mentoring programme."],
  ];

  const activities = rows.map((r) => {
    const [id, area, title, organiser, location, off, start, end, spotsTotal, spotsTaken, deadline, friends, description] = r;
    const startsAt = day(off, start);
    const endsAt = day(off, end);
    const signupClosesAt = deadline ? day(deadline[0], deadline[1]) : day(off - 1, "23:59");
    return {
      id, area, title, organiser, location, startsAt, endsAt,
      spotsTotal, spotsTaken, signupClosesAt, description,
      photoUrl: null,
      contact: { type: "email", value: "hello@example.org" },
      friendsGoing: friends,
      isSample: true,
    };
  });

  window.SAMPLE_DATA = {
    activities,
    student: { id: "s-sample", name: "Alex Lim", email: "alex.sample@example.org" },
    signInCode: "123456",
  };
})();
