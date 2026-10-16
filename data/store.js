
const hoursAgo = (hours) =>
    new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const daysAgo = (days, hours = 12) =>
    new Date(Date.now() - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000).toISOString();

// Demo-only in-memory data
export const stores = [
    // =========================================================
    // MARLOW KITCHEN
    // =========================================================
    {
        id: "rest_demo",
        email: "asd@gmail.com",
        password: "asd",
        name: "Marlow Kitchen",
        location: "Pretoria",
        description: "Modern comfort food",
        currency: "ZAR",
        capacity: 30,

        branding: {
            primaryColor: "#5b45d6",
            accentColor: "#ed9b40",
            fontFamily: "Inter"
        },

        // Each restaurant manages its own waiters
        waiters: [
            {
                id: "W101",
                name: "Sipho Mokoena",
                email: "sipho@marlow.test",
                phone: "0712345001",
                status: "Active",
                password:"asd",
                createdAt: daysAgo(60)
            },
            {
                id: "W102",
                name: "Thandi Nkosi",
                email: "thandi@marlow.test",
                phone: "0712345002",
                status: "Active",
                createdAt: daysAgo(45)
            },
            {
                id: "W103",
                name: "Jamie Peterson",
                email: "jamie@marlow.test",
                phone: "0712345003",
                status: "Active",
                createdAt: daysAgo(30)
            },
            {
                id: "W104",
                name: "Lerato Molefe",
                email: "lerato@marlow.test",
                phone: "0712345004",
                status: "Inactive",
                createdAt: daysAgo(20)
            },
            {
                id: "W105",
                name: "Daniel Smith",
                email: "daniel@marlow.test",
                phone: "0712345005",
                status: "Active",
                createdAt: daysAgo(10)
            }
        ],

        menu: [
            {
                id: "1",
                name: "Classic smash burger",
                description: "Double patty, cheddar, pickles, house sauce.",
                price: 125,
                category: "Burgers",
                imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
                available: true
            },
            {
                id: "2",
                name: "Margherita pizza",
                description: "Tomato, mozzarella, basil and olive oil.",
                price: 110,
                category: "Pizza",
                imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
                available: true
            },
            {
                id: "3",
                name: "Garden bowl",
                description: "Fresh greens, avocado, cucumber and lemon dressing.",
                price: 89,
                category: "Salads",
                imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
                available: true
            },
            {
                id: "4",
                name: "Crispy chicken burger",
                description: "Crispy chicken, lettuce, tomato and garlic mayo.",
                price: 115,
                category: "Burgers",
                imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600",
                available: true
            },
            {
                id: "5",
                name: "Loaded fries",
                description: "Golden fries with cheese sauce and house seasoning.",
                price: 65,
                category: "Sides",
                imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
                available: true
            },
            {
                id: "6",
                name: "BBQ chicken pizza",
                description: "Grilled chicken, BBQ sauce, mozzarella and red onion.",
                price: 135,
                category: "Pizza",
                imageUrl: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600",
                available: true
            },
            {
                id: "7",
                name: "Ribeye steak",
                description: "Grilled ribeye with chips and pepper sauce.",
                price: 195,
                category: "Mains",
                imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
                available: true
            },
            {
                id: "8",
                name: "Chocolate brownie",
                description: "Warm chocolate brownie served with vanilla ice cream.",
                price: 58,
                category: "Desserts",
                imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
                available: true
            },
            {
                id: "9",
                name: "Lemon iced tea",
                description: "Refreshing iced tea with lemon.",
                price: 32,
                category: "Drinks",
                imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600",
                available: true
            },
            {
                id: "10",
                name: "Vanilla milkshake",
                description: "Creamy vanilla milkshake.",
                price: 45,
                category: "Drinks",
                imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600",
                available: false
            }
        ],

        parties: [],
        orders: [],
        requests: []
    },

    // =========================================================
    // URBAN FORK
    // =========================================================
    {
        id: "rest_002",
        email: "admin@urbanfork.co.za",
        password: "demo002",
        name: "Urban Fork",
        location: "Johannesburg",
        description: "Contemporary urban dining",
        currency: "ZAR",
        capacity: 20,

        branding: {
            primaryColor: "#176b52",
            accentColor: "#e8b04a",
            fontFamily: "Inter"
        },

        waiters: [
            {
                id: "W201",
                name: "Thabo Nkosi",
                email: "thabo@urbanfork.test",
                phone: "0723456001",
                status: "Active",
                createdAt: daysAgo(60)
            },
            {
                id: "W202",
                name: "Amelia Dlamini",
                email: "amelia@urbanfork.test",
                phone: "0723456002",
                status: "Active",
                createdAt: daysAgo(40)
            },
            {
                id: "W203",
                name: "Kabelo Mokoena",
                email: "kabelo@urbanfork.test",
                phone: "0723456003",
                status: "Active",
                createdAt: daysAgo(25)
            },
            {
                id: "W204",
                name: "Zinhle Khumalo",
                email: "zinhle@urbanfork.test",
                phone: "0723456004",
                status: "Inactive",
                createdAt: daysAgo(15)
            }
        ],

        menu: [
            {
                id: "1",
                name: "BBQ chicken burger",
                description: "Grilled chicken, BBQ sauce and slaw.",
                price: 105,
                category: "Burgers",
                imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600",
                available: true
            },
            {
                id: "2",
                name: "Loaded fries",
                description: "Crispy fries with cheese and house sauce.",
                price: 65,
                category: "Sides",
                imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
                available: true
            },
            {
                id: "3",
                name: "Double beef burger",
                description: "Double beef patty, cheddar and pickles.",
                price: 135,
                category: "Burgers",
                imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
                available: true
            },
            {
                id: "4",
                name: "Pepperoni pizza",
                description: "Pepperoni, mozzarella and tomato sauce.",
                price: 120,
                category: "Pizza",
                imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
                available: true
            },
            {
                id: "5",
                name: "Chicken salad",
                description: "Grilled chicken, greens and honey mustard dressing.",
                price: 95,
                category: "Salads",
                imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
                available: true
            },
            {
                id: "6",
                name: "Chocolate cake",
                description: "Rich chocolate cake with chocolate icing.",
                price: 55,
                category: "Desserts",
                imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
                available: true
            },
            {
                id: "7",
                name: "Sparkling lemonade",
                description: "Fresh lemon with sparkling water.",
                price: 35,
                category: "Drinks",
                imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?w=600",
                available: true
            }
        ],

        parties: [
            {
                id: "P2001",
                location: "Table 4",
                customerCount: 2,
                customers: ["Musa Dube", "Lerato Dube"],
                waiterId: "W201",
                waiterName: "Thabo Nkosi",
                status: "Active",
                billingPreference: "separate",
                createdAt: hoursAgo(1)
            },
            {
                id: "P2002",
                location: "Table 6",
                customerCount: 4,
                customers: ["Aiden Smith", "Emma Smith", "Luke Smith", "Olivia Smith"],
                waiterId: "W202",
                waiterName: "Amelia Dlamini",
                status: "Active",
                billingPreference: "combined",
                createdAt: hoursAgo(2)
            },
            {
                id: "P2003",
                location: "Booth 1",
                customerCount: 3,
                customers: ["Sipho Zulu", "Nandi Zulu", "Bongi Zulu"],
                waiterId: "W203",
                waiterName: "Kabelo Mokoena",
                status: "Needs help",
                billingPreference: "combined",
                createdAt: hoursAgo(3)
            },
            {
                id: "P2004",
                location: "Table 9",
                customerCount: 5,
                customers: ["Ryan", "Chloe", "Liam", "Ella", "Jack"],
                waiterId: "W201",
                waiterName: "Thabo Nkosi",
                status: "Active",
                billingPreference: "separate",
                createdAt: hoursAgo(4)
            },
            {
                id: "P2005",
                location: "Window 2",
                customerCount: 2,
                customers: ["Palesa Mokoena", "Neo Mokoena"],
                waiterId: "W202",
                waiterName: "Amelia Dlamini",
                status: "Completed",
                billingPreference: "combined",
                createdAt: daysAgo(1)
            }
        ],

        orders: [
            {
                id: "UF-301",
                partyId: "P2001",
                customerName: "Musa Dube",
                items: [
                    { productId: "1", name: "BBQ chicken burger", quantity: 2, unitPrice: 105 },
                    { productId: "2", name: "Loaded fries", quantity: 1, unitPrice: 65 }
                ],
                total: 275,
                status: "Pending",
                rejectionReason: null,
                createdAt: hoursAgo(1)
            },
            {
                id: "UF-302",
                partyId: "P2002",
                customerName: "Aiden Smith",
                items: [
                    { productId: "3", name: "Double beef burger", quantity: 2, unitPrice: 135 },
                    { productId: "7", name: "Sparkling lemonade", quantity: 2, unitPrice: 35 }
                ],
                total: 340,
                status: "Confirmed",
                rejectionReason: null,
                createdAt: hoursAgo(2)
            },
            {
                id: "UF-303",
                partyId: "P2003",
                customerName: "Sipho Zulu",
                items: [
                    { productId: "4", name: "Pepperoni pizza", quantity: 1, unitPrice: 120 },
                    { productId: "6", name: "Chocolate cake", quantity: 2, unitPrice: 55 }
                ],
                total: 230,
                status: "Pending",
                rejectionReason: null,
                createdAt: hoursAgo(3)
            },
            {
                id: "UF-304",
                partyId: "P2004",
                customerName: "Ryan",
                items: [
                    { productId: "5", name: "Chicken salad", quantity: 2, unitPrice: 95 }
                ],
                total: 190,
                status: "Confirmed",
                rejectionReason: null,
                createdAt: hoursAgo(4)
            },
            {
                id: "UF-305",
                partyId: "P2002",
                customerName: "Emma Smith",
                items: [
                    { productId: "2", name: "Loaded fries", quantity: 2, unitPrice: 65 }
                ],
                total: 130,
                status: "Rejected",
                rejectionReason: "Kitchen unable to fulfil this order",
                createdAt: hoursAgo(5)
            },
            {
                id: "UF-306",
                partyId: "P2005",
                customerName: "Palesa Mokoena",
                items: [
                    { productId: "1", name: "BBQ chicken burger", quantity: 1, unitPrice: 105 },
                    { productId: "6", name: "Chocolate cake", quantity: 1, unitPrice: 55 }
                ],
                total: 160,
                status: "Confirmed",
                rejectionReason: null,
                createdAt: daysAgo(1)
            }
        ],

        requests: [
            {
                id: "UF-REQ-1",
                partyId: "P2001",
                type: "Call waiter",
                status: "Open",
                createdAt: hoursAgo(1)
            },
            {
                id: "UF-REQ-2",
                partyId: "P2003",
                type: "Request bill",
                status: "Open",
                createdAt: hoursAgo(2)
            },
            {
                id: "UF-REQ-3",
                partyId: "P2002",
                type: "Call waiter",
                status: "Acknowledged",
                createdAt: hoursAgo(3)
            },
            {
                id: "UF-REQ-4",
                partyId: "P2004",
                type: "Request bill",
                status: "Acknowledged",
                createdAt: hoursAgo(4)
            }
        ]
    },

    // =========================================================
    // COASTAL CAFÉ
    // =========================================================
    {
        id: "rest_003",
        email: "hello@coastalcafe.co.za",
        password: "demo003",
        name: "Coastal Café",
        location: "Cape Town",
        description: "Fresh coastal-inspired meals",
        currency: "ZAR",
        capacity: 25,

        branding: {
            primaryColor: "#167d9a",
            accentColor: "#f0a45d",
            fontFamily: "Inter"
        },

        waiters: [
            {
                id: "W301",
                name: "Amara Jacobs",
                email: "amara@coastalcafe.test",
                phone: "0734567001",
                status: "Active",
                createdAt: daysAgo(40)
            },
            {
                id: "W302",
                name: "Ethan Williams",
                email: "ethan@coastalcafe.test",
                phone: "0734567002",
                status: "Active",
                createdAt: daysAgo(20)
            },
            {
                id: "W303",
                name: "Mia Daniels",
                email: "mia@coastalcafe.test",
                phone: "0734567003",
                status: "Inactive",
                createdAt: daysAgo(10)
            }
        ],

        menu: [
            {
                id: "1",
                name: "Fish and chips",
                description: "Golden battered fish, chips and lemon.",
                price: 135,
                category: "Mains",
                imageUrl: "https://images.unsplash.com/photo-1579208570378-8c970854bc23?w=600",
                available: true
            },
            {
                id: "2",
                name: "Avocado toast",
                description: "Sourdough, avocado and cherry tomatoes.",
                price: 85,
                category: "Breakfast",
                imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600",
                available: true
            },
            {
                id: "3",
                name: "Grilled salmon",
                description: "Grilled salmon with greens and lemon butter.",
                price: 175,
                category: "Mains",
                imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
                available: true
            },
            {
                id: "4",
                name: "Prawn salad",
                description: "Prawns, mixed greens, avocado and citrus dressing.",
                price: 145,
                category: "Salads",
                imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
                available: true
            },
            {
                id: "5",
                name: "Iced coffee",
                description: "Chilled espresso with milk.",
                price: 42,
                category: "Drinks",
                imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
                available: true
            }
        ],

        parties: [
            {
                id: "P3001",
                location: "Window 2",
                customerCount: 3,
                customers: ["Amelia Brown", "Jack Brown", "Harry Brown"],
                waiterId: "W301",
                waiterName: "Amara Jacobs",
                status: "Active",
                billingPreference: "combined",
                createdAt: hoursAgo(2)
            },
            {
                id: "P3002",
                location: "Patio 1",
                customerCount: 2,
                customers: ["Grace Wilson", "Ella Wilson"],
                waiterId: "W302",
                waiterName: "Ethan Williams",
                status: "Active",
                billingPreference: "separate",
                createdAt: hoursAgo(3)
            }
        ],

        orders: [
            {
                id: "CC-401",
                partyId: "P3001",
                customerName: "Amelia Brown",
                items: [
                    { productId: "1", name: "Fish and chips", quantity: 2, unitPrice: 135 },
                    { productId: "5", name: "Iced coffee", quantity: 1, unitPrice: 42 }
                ],
                total: 312,
                status: "Confirmed",
                rejectionReason: null,
                createdAt: hoursAgo(2)
            },
            {
                id: "CC-402",
                partyId: "P3002",
                customerName: "Grace Wilson",
                items: [
                    { productId: "2", name: "Avocado toast", quantity: 2, unitPrice: 85 }
                ],
                total: 170,
                status: "Pending",
                rejectionReason: null,
                createdAt: hoursAgo(3)
            }
        ],

        requests: [
            {
                id: "CC-REQ-1",
                partyId: "P3001",
                type: "Call waiter",
                status: "Open",
                createdAt: hoursAgo(1)
            },
            {
                id: "CC-REQ-2",
                partyId: "P3002",
                type: "Request bill",
                status: "Acknowledged",
                createdAt: hoursAgo(2)
            }
        ]
    },

    // =========================================================
    // FIRE & GRILL
    // =========================================================
    {
        id: "rest_004",
        email: "admin@firegrill.co.za",
        password: "demo004",
        name: "Fire & Grill",
        location: "Durban",
        description: "Flame-grilled favourites",
        currency: "ZAR",
        capacity: 35,

        branding: {
            primaryColor: "#a52c26",
            accentColor: "#f2a33a",
            fontFamily: "Inter"
        },

        waiters: [
            {
                id: "W401",
                name: "Lerato Dlamini",
                email: "lerato@firegrill.test",
                phone: "0745678001",
                status: "Active",
                createdAt: daysAgo(50)
            },
            {
                id: "W402",
                name: "Sibusiso Khumalo",
                email: "sibusiso@firegrill.test",
                phone: "0745678002",
                status: "Active",
                createdAt: daysAgo(25)
            },
            {
                id: "W403",
                name: "Ayanda Ndlovu",
                email: "ayanda@firegrill.test",
                phone: "0745678003",
                status: "Active",
                createdAt: daysAgo(12)
            }
        ],

        menu: [
            {
                id: "1",
                name: "Rump steak",
                description: "Grilled rump steak with chips.",
                price: 185,
                category: "Mains",
                imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
                available: true
            },
            {
                id: "2",
                name: "Chicken wings",
                description: "Sticky grilled wings with a spicy glaze.",
                price: 95,
                category: "Starters",
                imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600",
                available: true
            },
            {
                id: "3",
                name: "BBQ ribs",
                description: "Slow-cooked ribs glazed with smoky BBQ sauce.",
                price: 220,
                category: "Mains",
                imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
                available: true
            },
            {
                id: "4",
                name: "Grilled chicken",
                description: "Flame-grilled chicken with a side of chips.",
                price: 145,
                category: "Mains",
                imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600",
                available: true
            },
            {
                id: "5",
                name: "Chocolate sundae",
                description: "Vanilla ice cream, chocolate sauce and sprinkles.",
                price: 55,
                category: "Desserts",
                imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600",
                available: true
            }
        ],

        parties: [
            {
                id: "P4001",
                location: "Deck",
                customerCount: 5,
                customers: ["Noah", "Oliver", "Lucas", "Ethan", "Mason"],
                waiterId: "W401",
                waiterName: "Lerato Dlamini",
                status: "Active",
                billingPreference: "combined",
                createdAt: hoursAgo(1)
            },
            {
                id: "P4002",
                location: "Table 3",
                customerCount: 2,
                customers: ["Charlotte", "Amelia"],
                waiterId: "W402",
                waiterName: "Sibusiso Khumalo",
                status: "Needs help",
                billingPreference: "separate",
                createdAt: hoursAgo(2)
            }
        ],

        orders: [
            {
                id: "FG-501",
                partyId: "P4001",
                customerName: "Noah",
                items: [
                    { productId: "1", name: "Rump steak", quantity: 2, unitPrice: 185 },
                    { productId: "2", name: "Chicken wings", quantity: 1, unitPrice: 95 }
                ],
                total: 465,
                status: "Pending",
                rejectionReason: null,
                createdAt: hoursAgo(1)
            },
            {
                id: "FG-502",
                partyId: "P4002",
                customerName: "Charlotte",
                items: [
                    { productId: "3", name: "BBQ ribs", quantity: 1, unitPrice: 220 },
                    { productId: "5", name: "Chocolate sundae", quantity: 2, unitPrice: 55 }
                ],
                total: 330,
                status: "Confirmed",
                rejectionReason: null,
                createdAt: hoursAgo(2)
            }
        ],

        requests: [
            {
                id: "FG-REQ-1",
                partyId: "P4002",
                type: "Call waiter",
                status: "Open",
                createdAt: hoursAgo(1)
            },
            {
                id: "FG-REQ-2",
                partyId: "P4001",
                type: "Request bill",
                status: "Acknowledged",
                createdAt: hoursAgo(2)
            }
        ]
    }
];
