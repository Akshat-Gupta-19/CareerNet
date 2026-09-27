import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/user.model.js";
import Post from "./models/post.model.js";
import Connection from "./models/connection.model.js";
import Notification from "./models/notification.model.js";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.log("❌ MONGODB_URL is missing in .env");
  process.exit(1);
}

/* =========================
   DEMO USERS
========================= */

const demoUsers = [
  {
    firstName: "Rahul",
    lastName: "Sharma",
    username: "rahul_sharma",
    email: "rahul@careernet.demo",
    headline: "Full Stack Developer | MERN Stack",
    about:
      "Passionate Full Stack Developer who loves building scalable web applications and solving real-world problems.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
    location: "Indore, India",
    gender: "male",
    profileImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "IPS Academy",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
      },
    ],
    experience: [
      {
        title: "MERN Stack Developer",
        company: "TechNova Solutions",
        description: "Building modern full-stack web applications.",
      },
    ],
  },

  {
    firstName: "Priya",
    lastName: "Verma",
    username: "priya_verma",
    email: "priya@careernet.demo",
    headline: "Frontend Developer | React.js",
    about:
      "Frontend developer focused on creating clean, responsive and user-friendly interfaces.",
    skills: ["React", "JavaScript", "Tailwind CSS", "HTML", "CSS"],
    location: "Bhopal, India",
    gender: "female",
    profileImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "Barkatullah University",
        degree: "B.Tech",
        fieldOfStudy: "Information Technology",
      },
    ],
    experience: [
      {
        title: "Frontend Developer",
        company: "PixelCraft",
        description: "Developing responsive React interfaces.",
      },
    ],
  },

  {
    firstName: "Arjun",
    lastName: "Mehta",
    username: "arjun_mehta",
    email: "arjun@careernet.demo",
    headline: "Backend Developer | Node.js",
    about:
      "Backend developer interested in APIs, databases, authentication and scalable systems.",
    skills: ["Node.js", "Express", "MongoDB", "REST API", "JWT"],
    location: "Pune, India",
    gender: "male",
    profileImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "MIT Pune",
        degree: "B.Tech",
        fieldOfStudy: "Computer Engineering",
      },
    ],
    experience: [
      {
        title: "Backend Developer",
        company: "CloudStack",
        description: "Working on Node.js APIs and database systems.",
      },
    ],
  },

  {
    firstName: "Sneha",
    lastName: "Patel",
    username: "sneha_patel",
    email: "sneha@careernet.demo",
    headline: "UI/UX Designer | Product Designer",
    about:
      "Designer who enjoys turning complex ideas into simple and intuitive digital experiences.",
    skills: ["Figma", "UI/UX", "Wireframing", "Prototyping", "Design Systems"],
    location: "Ahmedabad, India",
    gender: "female",
    profileImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "CEPT University",
        degree: "Bachelor",
        fieldOfStudy: "Design",
      },
    ],
    experience: [
      {
        title: "Product Designer",
        company: "DesignHub",
        description: "Designing web and mobile product experiences.",
      },
    ],
  },

  {
    firstName: "Aditya",
    lastName: "Singh",
    username: "aditya_singh",
    email: "aditya@careernet.demo",
    headline: "Software Engineer | DSA Enthusiast",
    about:
      "Software engineer focused on problem solving, data structures and building reliable applications.",
    skills: ["C++", "DSA", "Java", "SQL", "Git"],
    location: "Delhi, India",
    gender: "male",
    profileImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "Delhi Technological University",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
      },
    ],
    experience: [
      {
        title: "Software Engineer Intern",
        company: "CodeLabs",
        description: "Worked on backend services and algorithmic problems.",
      },
    ],
  },

  {
    firstName: "Ananya",
    lastName: "Joshi",
    username: "ananya_joshi",
    email: "ananya@careernet.demo",
    headline: "Data Analyst | Python | SQL",
    about:
      "Data enthusiast who enjoys discovering insights from data and building useful dashboards.",
    skills: ["Python", "SQL", "Excel", "Power BI", "Data Analysis"],
    location: "Mumbai, India",
    gender: "female",
    profileImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "NMIMS",
        degree: "B.Tech",
        fieldOfStudy: "Information Technology",
      },
    ],
    experience: [
      {
        title: "Data Analyst Intern",
        company: "DataWorks",
        description: "Created dashboards and analyzed business data.",
      },
    ],
  },

  {
    firstName: "Karan",
    lastName: "Malhotra",
    username: "karan_malhotra",
    email: "karan@careernet.demo",
    headline: "DevOps Engineer | AWS",
    about:
      "DevOps enthusiast working with cloud infrastructure, CI/CD and deployment automation.",
    skills: ["AWS", "Docker", "GitHub Actions", "Linux", "CI/CD"],
    location: "Bengaluru, India",
    gender: "male",
    profileImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "RV College of Engineering",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
      },
    ],
    experience: [
      {
        title: "DevOps Intern",
        company: "CloudWorks",
        description: "Worked on cloud deployment and CI/CD pipelines.",
      },
    ],
  },

  {
    firstName: "Riya",
    lastName: "Kapoor",
    username: "riya_kapoor",
    email: "riya@careernet.demo",
    headline: "Full Stack Developer | MERN",
    about:
      "Full stack developer who enjoys creating products from idea to deployment.",
    skills: ["MongoDB", "Express", "React", "Node.js", "Socket.IO"],
    location: "Jaipur, India",
    gender: "female",
    profileImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "Manipal University",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
      },
    ],
    experience: [
      {
        title: "Full Stack Developer",
        company: "WebWorks",
        description: "Building MERN stack applications.",
      },
    ],
  },

  {
    firstName: "Vikram",
    lastName: "Rao",
    username: "vikram_rao",
    email: "vikram@careernet.demo",
    headline: "Mobile Developer | React Native",
    about:
      "Developer interested in mobile applications and cross-platform development.",
    skills: ["React Native", "JavaScript", "Firebase", "REST API", "Git"],
    location: "Hyderabad, India",
    gender: "male",
    profileImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "Osmania University",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
      },
    ],
    experience: [
      {
        title: "React Native Developer",
        company: "AppLabs",
        description: "Developing cross-platform mobile applications.",
      },
    ],
  },

  {
    firstName: "Neha",
    lastName: "Agarwal",
    username: "neha_agarwal",
    email: "neha@careernet.demo",
    headline: "Software Engineer | AI & Web Development",
    about:
      "Software engineer exploring AI-powered applications and modern web technologies.",
    skills: ["JavaScript", "React", "Python", "AI", "Node.js"],
    location: "Chandigarh, India",
    gender: "female",
    profileImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    education: [
      {
        college: "Chandigarh University",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
      },
    ],
    experience: [
      {
        title: "Software Engineer Intern",
        company: "InnovateAI",
        description: "Building AI-powered web applications.",
      },
    ],
  },
];

/* =========================
   POSTS
========================= */

const postData = [
  {
    username: "rahul_sharma",
    description:
      "Just completed a new MERN stack project! 🚀 Building full-stack applications from scratch is challenging, but seeing everything work together makes it worth it.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },

  {
    username: "priya_verma",
    description:
      "Spent the weekend improving my React skills and building responsive UI components. Small improvements every day eventually create big results. 💻",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },

  {
    username: "arjun_mehta",
    description:
      "Learning more about backend architecture, authentication and scalable APIs. Node.js + Express continues to be an amazing combination for web development.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  },

  {
    username: "sneha_patel",
    description:
      "Good design is not only about making things look beautiful. It's about making the product simple and enjoyable to use. 🎨",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
  },

  {
    username: "aditya_singh",
    description:
      "Consistency is the most underrated skill in software engineering. Solving one DSA problem every day feels small, but the progress adds up.",
    image: "",
  },

  {
    username: "ananya_joshi",
    description:
      "Started exploring data visualization today. Turning raw numbers into meaningful insights is surprisingly satisfying! 📊",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },

  {
    username: "karan_malhotra",
    description:
      "Finally deployed a project using a proper CI/CD pipeline. The first successful automated deployment feels amazing! ☁️",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  },

  {
    username: "riya_kapoor",
    description:
      "Working on a real-time feature using Socket.IO. Real-time communication makes applications feel completely different.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  },

  {
    username: "vikram_rao",
    description:
      "Exploring cross-platform mobile development. React Native makes it much easier to share logic across platforms.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
  },

  {
    username: "neha_agarwal",
    description:
      "AI + Web Development is an exciting combination. There are so many possibilities for building smarter products.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
  },
];

/* =========================
   MAIN SEED FUNCTION
========================= */

const seedDatabase = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URL);

    console.log("✅ MongoDB connected");

    /* =========================
       REMOVE ONLY OLD DEMO DATA
    ========================= */

    const demoEmails = demoUsers.map((user) => user.email);

    const oldDemoUsers = await User.find({
      email: { $in: demoEmails },
    });

    const oldDemoUserIds = oldDemoUsers.map((user) => user._id);

    if (oldDemoUserIds.length > 0) {
      console.log("🧹 Removing old demo data...");

      await Notification.deleteMany({
        $or: [
          { receiver: { $in: oldDemoUserIds } },
          { relatedUser: { $in: oldDemoUserIds } },
        ],
      });

      await Connection.deleteMany({
        $or: [
          { sender: { $in: oldDemoUserIds } },
          { receiver: { $in: oldDemoUserIds } },
        ],
      });

      await Post.deleteMany({
        author: { $in: oldDemoUserIds },
      });

      await User.deleteMany({
        _id: { $in: oldDemoUserIds },
      });
    }

    /* =========================
       PASSWORD
    ========================= */

    const hashedPassword = await bcrypt.hash("Demo@123", 10);

    /* =========================
       CREATE USERS
    ========================= */

    console.log("👥 Creating demo users...");

    const createdUsers = [];

    for (const user of demoUsers) {
      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      });

      createdUsers.push(newUser);
    }

    const users = {};

    createdUsers.forEach((user) => {
      users[user.username] = user;
    });

    console.log(`✅ ${createdUsers.length} users created`);

    /* =========================
       CONNECTIONS
    ========================= */

    console.log("🤝 Creating connections...");

    const acceptedPairs = [
      ["rahul_sharma", "priya_verma"],
      ["rahul_sharma", "arjun_mehta"],
      ["rahul_sharma", "sneha_patel"],
      ["priya_verma", "riya_kapoor"],
      ["arjun_mehta", "karan_malhotra"],
      ["aditya_singh", "ananya_joshi"],
      ["riya_kapoor", "neha_agarwal"],
    ];

    for (const [senderUsername, receiverUsername] of acceptedPairs) {
      const sender = users[senderUsername];
      const receiver = users[receiverUsername];

      await Connection.create({
        sender: sender._id,
        receiver: receiver._id,
        status: "accepted",
      });

      await User.findByIdAndUpdate(sender._id, {
        $addToSet: {
          connection: receiver._id,
        },
      });

      await User.findByIdAndUpdate(receiver._id, {
        $addToSet: {
          connection: sender._id,
        },
      });
    }

    /* =========================
       PENDING REQUESTS
    ========================= */

    const pendingPairs = [
      ["aditya_singh", "rahul_sharma"],
      ["vikram_rao", "rahul_sharma"],
      ["neha_agarwal", "priya_verma"],
    ];

    for (const [senderUsername, receiverUsername] of pendingPairs) {
      await Connection.create({
        sender: users[senderUsername]._id,
        receiver: users[receiverUsername]._id,
        status: "pending",
      });
    }

    console.log("✅ Connections created");

    /* =========================
       POSTS
    ========================= */

    console.log("📝 Creating posts...");

    const createdPosts = [];

    for (const post of postData) {
      const author = users[post.username];

      const newPost = await Post.create({
        author: author._id,
        description: post.description,
        image: post.image,
        like: [],
        comment: [],
      });

      createdPosts.push(newPost);
    }

    console.log(`✅ ${createdPosts.length} posts created`);

    /* =========================
       LIKES
    ========================= */

    console.log("❤️ Adding likes...");

    await Post.findByIdAndUpdate(createdPosts[0]._id, {
      $addToSet: {
        like: {
          $each: [
            users.priya_verma._id,
            users.arjun_mehta._id,
            users.sneha_patel._id,
            users.riya_kapoor._id,
          ],
        },
      },
    });

    await Post.findByIdAndUpdate(createdPosts[1]._id, {
      $addToSet: {
        like: {
          $each: [
            users.rahul_sharma._id,
            users.riya_kapoor._id,
            users.neha_agarwal._id,
          ],
        },
      },
    });

    await Post.findByIdAndUpdate(createdPosts[2]._id, {
      $addToSet: {
        like: {
          $each: [
            users.rahul_sharma._id,
            users.karan_malhotra._id,
          ],
        },
      },
    });

    await Post.findByIdAndUpdate(createdPosts[3]._id, {
      $addToSet: {
        like: {
          $each: [
            users.priya_verma._id,
            users.ananya_joshi._id,
          ],
        },
      },
    });

    await Post.findByIdAndUpdate(createdPosts[6]._id, {
      $addToSet: {
        like: {
          $each: [
            users.rahul_sharma._id,
            users.arjun_mehta._id,
            users.neha_agarwal._id,
          ],
        },
      },
    });

    console.log("✅ Likes added");

    /* =========================
       COMMENTS
    ========================= */

    console.log("💬 Adding comments...");

    await Post.findByIdAndUpdate(createdPosts[0]._id, {
      $push: {
        comment: [
          {
            author: users.priya_verma._id,
            content: "Amazing work! 🔥",
          },
          {
            author: users.arjun_mehta._id,
            content: "This looks really good!",
          },
          {
            author: users.sneha_patel._id,
            content: "Love the UI!",
          },
        ],
      },
    });

    await Post.findByIdAndUpdate(createdPosts[1]._id, {
      $push: {
        comment: [
          {
            author: users.rahul_sharma._id,
            content: "React is definitely fun to work with.",
          },
          {
            author: users.riya_kapoor._id,
            content: "Great progress! Keep going.",
          },
        ],
      },
    });

    await Post.findByIdAndUpdate(createdPosts[2]._id, {
      $push: {
        comment: [
          {
            author: users.karan_malhotra._id,
            content: "Backend architecture is always interesting.",
          },
        ],
      },
    });

    await Post.findByIdAndUpdate(createdPosts[6]._id, {
      $push: {
        comment: [
          {
            author: users.rahul_sharma._id,
            content: "CI/CD is a game changer 🚀",
          },
        ],
      },
    });

    console.log("✅ Comments added");

    /* =========================
       NOTIFICATIONS
    ========================= */

    console.log("🔔 Creating notifications...");

    await Notification.create([
      {
        receiver: users.rahul_sharma._id,
        type: "like",
        relatedUser: users.priya_verma._id,
        relatedPost: createdPosts[0]._id,
      },

      {
        receiver: users.rahul_sharma._id,
        type: "like",
        relatedUser: users.arjun_mehta._id,
        relatedPost: createdPosts[0]._id,
      },

      {
        receiver: users.rahul_sharma._id,
        type: "comment",
        relatedUser: users.sneha_patel._id,
        relatedPost: createdPosts[0]._id,
      },

      {
        receiver: users.priya_verma._id,
        type: "like",
        relatedUser: users.rahul_sharma._id,
        relatedPost: createdPosts[1]._id,
      },

      {
        receiver: users.priya_verma._id,
        type: "comment",
        relatedUser: users.riya_kapoor._id,
        relatedPost: createdPosts[1]._id,
      },

      {
        receiver: users.rahul_sharma._id,
        type: "connectionAccepted",
        relatedUser: users.priya_verma._id,
      },

      {
        receiver: users.priya_verma._id,
        type: "connectionAccepted",
        relatedUser: users.riya_kapoor._id,
      },
    ]);

    console.log("✅ Notifications created");

    /* =========================
       FINAL MESSAGE
    ========================= */

    console.log("\n====================================");
    console.log("🎉 CAREERNET DEMO DATA READY!");
    console.log("====================================");

    console.log("\n👥 Users:", createdUsers.length);
    console.log("📝 Posts:", createdPosts.length);
    console.log("🤝 Accepted connections:", acceptedPairs.length);
    console.log("📨 Pending requests:", pendingPairs.length);
    console.log("❤️ Likes: Added");
    console.log("💬 Comments: Added");
    console.log("🔔 Notifications: Added");

    console.log("\n🔐 Demo Login");
    console.log("-----------------------------");
    console.log("Email    : rahul@careernet.demo");
    console.log("Password : Demo@123");
    console.log("-----------------------------");

    console.log("\n🚀 You can now start CareerNet!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seed Error:");
    console.error(error);

    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();