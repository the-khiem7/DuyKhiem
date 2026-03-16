import type { SiteLocale } from '@/utils/i18n'

type Primitive = string | number | boolean | null | undefined

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Primitive
    ? T[K]
    : T[K] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : DeepPartial<T[K]>
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepMerge<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) return base

  if (Array.isArray(base)) {
    return (override as T) ?? base
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as T) ?? base
  }

  const result: Record<string, unknown> = { ...base }

  for (const [key, value] of Object.entries(override)) {
    const current = result[key]
    if (value === undefined) continue

    result[key] =
      isPlainObject(current) && isPlainObject(value)
        ? deepMerge(current as Record<string, unknown>, value as DeepPartial<Record<string, unknown>>)
        : Array.isArray(value)
          ? value
          : value
  }

  return result as T
}

const en = {
  shared: {
    nav: {
      blog: 'Blog',
      docs: 'Docs',
      projects: 'Projects',
      links: 'Links',
      about: 'About'
    },
    actions: {
      search: 'Search',
      back: 'Back',
      menu: 'Menu',
      darkTheme: 'Dark Theme',
      setTheme: 'Set theme to'
    },
    footer: {
      creditsSuffix: 'theme powered',
      rssLabel: 'RSS'
    }
  },
  home: {
    metaTitle: 'Home',
    hero: {
      description: 'Backend-first engineer building workflow-heavy systems, cloud-native services, and applied AI.',
      location: 'Ho Chi Minh City',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      resume: 'Download my resume'
    },
    sections: {
      about: 'About',
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      certifications: 'Certifications',
      posts: 'Posts',
      skills: 'Skills'
    },
    about: {
      subtitle: 'Software Engineering Student at FPT University',
      paragraphs: [
        'I focus on backend systems where architecture directly shapes reliability, operations, and user trust. My recent work spans ASP.NET Core platforms, approval workflows, event-driven microservices, AWS serverless pipelines, analytics workloads, and AI-assisted products.',
        'I am most interested in products that turn messy real-world processes into systems that are easier to run, easier to trust, and easier to scale.'
      ],
      cta: 'More about me'
    },
    experience: {
      awsLocation: 'Bitexco Financial Tower, Ho Chi Minh City · Hybrid',
      awsBullets: [
        'Built a clickstream analytics pipeline with S3, Lambda, EventBridge, PostgreSQL, and R Shiny.',
        'Worked on private networking boundaries, IAM-aware design, and production-style AWS delivery.',
        'Used LocalStack and Terraform to create a repeatable cloud development workflow.'
      ],
      fptLocation: 'Saigon Hi-Tech Park, Ho Chi Minh City · On-site',
      fptBullets: [
        'Built an ASP.NET Core financial claim workflow system used across 5+ departments.',
        'Modeled approval logic as a state-driven workflow with role-based transitions and audit-ready history.',
        'Led a team of 10 and automated build, test, and deployment to Azure App Service with GitHub Actions.'
      ]
    },
    education: {
      body: 'Expected graduation in June 2026. My academic path has run in parallel with internships and product-oriented side projects focused on backend architecture, cloud systems, and applied AI.'
    },
    projects: {
      moreHeading: 'More projects',
      cards: {
        snakeaid: 'AI-powered healthcare platform for snakebite response, identification, and rescue coordination.',
        alohamarket: 'Event-driven marketplace backend built with Kafka, .NET Aspire, Keycloak, and YARP.',
        ezyfix: 'Home-repair marketplace backend with escrow payments, payouts, and real-time updates.',
        more: 'See the full project list, supporting systems, and technical focus areas.'
      }
    },
    certifications: {
      subtitle:
        'The Linux Foundation, UC Irvine, Board Infinity, University of Minnesota',
      items: [
        'LFS167: Introduction to Jenkins',
        'Project Management Principles and Practices Specialization',
        'Java FullStack Developer Specialization',
        'Software Development Lifecycle Specialization'
      ]
    },
    posts: {
      more: 'More posts'
    },
    skills: {
      backend: 'Backend',
      systems: 'Systems',
      cloudAndAi: 'Cloud & AI'
    }
  },
  about: {
    title: 'About',
    cta: 'View projects',
    headings: {
      overview: 'Overview',
      focusAreas: 'Focus Areas',
      experienceSnapshot: 'Experience Snapshot',
      educationCertifications: 'Education & Certifications',
      selectedTimeline: 'Selected Timeline'
    },
    intro: [
      'I am a backend-first engineer based in Ho Chi Minh City, Vietnam.',
      'The kind of systems I enjoy most are the ones that have real operational weight behind them: approval flows that people depend on, marketplace backends that have to coordinate multiple moving parts, analytics pipelines that turn raw activity into something decision-makers can use, and AI features that need to fit into a product instead of living as a demo in isolation.',
      'That is the thread running through most of my work. I am less interested in building isolated features than in shaping the underlying system that makes a product reliable, understandable, and scalable over time.'
    ],
    overview: [
      'My background started with backend development in ASP.NET Core, then gradually expanded into event-driven architecture, cloud deployment workflows, analytics systems, and practical AI integration. What ties those areas together for me is not the technology itself, but the kind of responsibility they require. Once a system touches approvals, payments, notifications, infrastructure boundaries, or machine-generated decisions, the backend stops being an invisible layer and becomes the place where product trust is actually built.',
      'I learn the most from environments where business rules are messy, system boundaries matter, and reliability is part of the user experience. Those are the projects that force better engineering judgment, not just more implementation.'
    ],
    focusAreas: [
      'Workflow-heavy backend systems where state, auditability, and business rules matter as much as feature delivery.',
      'Distributed and cloud-native architectures using tools such as Kafka, YARP, SignalR, and AWS serverless services.',
      'Applied AI in product contexts, especially when a model needs to be integrated into a usable end-to-end workflow.',
      'Operationally meaningful integrations across payments, notifications, geolocation, media storage, and analytics.',
      'Product engineering that stays grounded in real constraints instead of stopping at a technical prototype.'
    ],
    experienceSnapshot: [
      'At Amazon Web Services, through the FCAJ program, I worked on a clickstream analytics platform that combined ingestion, scheduled transformation, internal data access boundaries, and dashboard-ready output. What stayed with me from that experience was not just the AWS stack itself, but the discipline of thinking about pipelines as systems that must be safe to operate, repeatable to deploy, and understandable to the people using the output.',
      'At FPT Software, I worked on the Claim Request System, a workflow-driven internal platform for financial approvals. That project sharpened a different side of my engineering mindset: how to model state transitions carefully, how to make business rules explicit, and how to turn a manual operational process into software that people can trust across departments.',
      'Across personal and team projects, I kept moving in that same direction. AlohaMarket pushed me deeper into service boundaries and event-driven design. EzyFix made payments, settlement, and operational coordination more concrete. SnakeAid pushed me to think about how AI should support a real product workflow rather than sit beside it as a separate experiment.'
    ],
    education: {
      paragraphs: [
        'I am studying Software Engineering at FPT University, Ho Chi Minh City Campus, with expected graduation in June 2026.',
        'Along the way, I have also used certifications as a way to strengthen fundamentals around delivery, process, and engineering discipline instead of treating them as credentials alone.',
        'Selected certifications include:'
      ],
      certifications: [
        'LFS167: Introduction to Jenkins - The Linux Foundation',
        'Project Management Principles and Practices Specialization - UC Irvine',
        'Java FullStack Developer Specialization - Board Infinity',
        'Software Development Lifecycle Specialization - University of Minnesota'
      ]
    },
    timeline: [
      {
        date: '2024-05',
        content:
          'Built <strong>TTK Piano Center</strong>, an early Java web project that gave me a solid foundation in multi-role systems and structured backend thinking.'
      },
      {
        date: '2024-12',
        content:
          'Joined <strong>FPT Software</strong> and worked on the Claim Request System, where workflow modeling became a central part of how I think about backend design.'
      },
      {
        date: '2025-05',
        content:
          'Worked on larger systems such as <strong>AlohaMarket</strong> and <strong>VitaFlow</strong>, expanding into service boundaries, layered architecture, and operational workflows.'
      },
      {
        date: '2025-08',
        content:
          'Built <strong>EzyFix</strong> and <strong>CellphoneZ</strong>, moving further into marketplace logic, payment handling, and user-facing product delivery.'
      },
      {
        date: '2025-09',
        content:
          'Joined the <strong>AWS FCAJ Program</strong> and delivered a serverless clickstream analytics platform, deepening my interest in cloud-native systems and analytics pipelines.'
      },
      {
        date: '2025-11',
        content:
          'Continued building <strong>SnakeAid</strong>, combining backend engineering with AI-assisted healthcare workflows in a more product-driven way.'
      }
    ]
  },
  projects: {
    title: 'Projects',
    intro: [
      'My strongest projects sit around workflow-heavy systems, distributed backends, cloud-native infrastructure, and applied AI. I care most about projects where backend architecture directly shapes operations, reliability, and user trust.',
      'If you want to discuss a backend, cloud, or product engineering opportunity, feel free to reach out through GitHub or LinkedIn.'
    ],
    cta: 'View my GitHub',
    headings: {
      flagship: 'Flagship Projects',
      other: 'Other Projects',
      whatTheseProjectsShow: 'What These Projects Show'
    },
    groupTitles: {
      'devops-and-site-reliability': 'DevOps & Site Reliability',
      linux: 'Linux',
      'computer-vision-and-ml': 'Computer Vision & ML',
      'service-platforms': 'Service Platforms',
      'mobile-apps-and-android': 'Mobile Apps & Android',
      'student-productivity-and-edtech': 'Student Productivity & EdTech',
      'business-and-operations-systems': 'Business & Operations Systems',
      'healthcare-platforms': 'Healthcare Platforms',
      'unity-games': 'Unity Games'
    },
    summaryBullets: [
      'I am strongest when the problem involves workflows, backend architecture, and operational complexity.',
      'I can work across multiple service boundaries instead of staying inside a single API or UI layer.',
      'I am comfortable mixing product delivery with infrastructure, integrations, data flows, and AI features.',
      'I prefer projects where technical decisions have visible impact on reliability, transparency, and maintainability.'
    ],
    tocTitle: 'PROJECTS',
    tocGroups: {
      flagship: 'Flagship',
      other: 'Other'
    }
  },
  links: {
    title: 'Links',
    headings: {
      common: 'Common Links',
      special: 'Special Links',
      apply: 'Apply Links'
    },
    intro: "They're sorted randomly.",
    badStatus: 'Links with Bad Status',
    historyBook: 'Link History Book',
    applyInfo: 'Site information (click to copy):',
    copied: 'Copied',
    applyIntro:
      'Apply your link by leaving a comment or submitting a PR. Additional info:',
    applyViaPr: 'Submitting a PR',
    rules: [
      "You've recommended our link on your website",
      'Make sure your site is alive with a formal domain',
      'At least 5 original articles and active updates in the recent year',
      'Content does not violate laws'
    ],
    empty: 'Nothing here.',
    applyTipLabels: {
      Name: 'Name',
      Desc: 'Description',
      Link: 'Link',
      Avatar: 'Avatar'
    }
  },
  docs: {
    title: 'Docs',
    metaDescription: 'Docs content documentation',
    back: 'Back',
    heading: 'Docs of Nguyen Van Duy Khiem',
    sections: {
      themeDocumentation: 'Theme documentation',
      feedback: 'Feedback',
      news: 'News Feed'
    },
    feedback:
      'If you have any problems, you can check GitHub Issues for community support.',
    editOnGitHub: 'Edit on GitHub',
    tocTitle: 'DOCS',
    tocCategories: {
      setup: 'Setup',
      integrations: 'Integrations',
      advanced: 'Advanced'
    }
  },
  search: {
    title: 'Search',
    metaDescription: 'Search relative posts of the whole blog',
    intro: 'Enter a search term or phrase to search the blog.',
    disabled: 'Pagefind is disabled.'
  }
}

type SiteDictionary = typeof en

const vi: DeepPartial<SiteDictionary> = {
  shared: {
    nav: {
      blog: 'Blog',
      docs: 'Tai lieu',
      projects: 'Du an',
      links: 'Lien ket',
      about: 'Gioi thieu'
    },
    actions: {
      search: 'Tim kiem',
      back: 'Quay lai',
      menu: 'Menu',
      darkTheme: 'Giao dien',
      setTheme: 'Da chuyen giao dien sang'
    },
    footer: {
      creditsSuffix: 'van hanh boi theme',
      rssLabel: 'RSS'
    }
  },
  home: {
    metaTitle: 'Trang chu',
    hero: {
      description: 'Ky su thien ve backend, xay dung cac he thong workflow, dich vu cloud-native va san pham co ung dung AI.',
      location: 'Thanh pho Ho Chi Minh',
      resume: 'Tai CV'
    },
    sections: {
      about: 'Gioi thieu',
      experience: 'Kinh nghiem',
      education: 'Hoc van',
      projects: 'Du an',
      certifications: 'Chung chi',
      posts: 'Bai viet',
      skills: 'Ky nang'
    },
    about: {
      subtitle: 'Sinh vien Ky thuat Phan mem tai Dai hoc FPT',
      paragraphs: [
        'Minh tap trung vao backend, noi kien truc anh huong truc tiep den do tin cay, van hanh va niem tin cua nguoi dung. Cong viec gan day cua minh trai dai tu nen tang ASP.NET Core, he thong phe duyet, microservice event-driven, AWS serverless, pipeline phan tich du lieu cho den cac san pham co AI.',
        'Minh dac biet quan tam den nhung san pham bien cac quy trinh thuc te nhieu rang buoc thanh he thong de van hanh hon, de tin tuong hon va de mo rong hon.'
      ],
      cta: 'Xem them ve toi'
    },
    experience: {
      awsBullets: [
        'Xay dung pipeline clickstream analytics bang S3, Lambda, EventBridge, PostgreSQL va R Shiny.',
        'Lam viec voi networking boundaries, IAM-aware design va quy trinh giao hang theo kieu production tren AWS.',
        'Su dung LocalStack va Terraform de tao workflow phat trien cloud co the lap lai.'
      ],
      fptBullets: [
        'Xay dung he thong phe duyet tai chinh bang ASP.NET Core duoc su dung boi hon 5 phong ban.',
        'Mo hinh hoa logic phe duyet thanh workflow dua tren state, co role transition va lich su audit ro rang.',
        'Dan dat nhom 10 nguoi va tu dong hoa build, test, deploy len Azure App Service bang GitHub Actions.'
      ]
    },
    education: {
      body: 'Du kien tot nghiep vao thang 6/2026. Qua trinh hoc cua minh dien ra song song voi intern va cac du an mang tinh san pham, tap trung vao backend architecture, cloud systems va applied AI.'
    },
    projects: {
      moreHeading: 'Them du an',
      cards: {
        snakeaid: 'Nen tang y te co AI cho phan ung can ran, nhan dien va dieu phoi cuu ho.',
        alohamarket: 'Backend marketplace event-driven xay dung bang Kafka, .NET Aspire, Keycloak va YARP.',
        ezyfix: 'Backend san giao dich sua chua nha voi escrow, payout va real-time updates.',
        more: 'Xem toan bo danh sach du an, cac he thong ho tro va huong tap trung ky thuat.'
      }
    },
    certifications: {
      items: [
        'LFS167: Gioi thieu Jenkins',
        'Chuyen nganh Nguyen ly va Thuc hanh Quan ly du an',
        'Chuyen nganh Java FullStack Developer',
        'Chuyen nganh Software Development Lifecycle'
      ]
    },
    posts: {
      more: 'Xem them bai viet'
    },
    skills: {
      backend: 'Backend',
      systems: 'He thong',
      cloudAndAi: 'Cloud & AI'
    }
  },
  about: {
    title: 'Gioi thieu',
    cta: 'Xem du an',
    headings: {
      overview: 'Tong quan',
      focusAreas: 'Huong tap trung',
      experienceSnapshot: 'Tom tat kinh nghiem',
      educationCertifications: 'Hoc van va chung chi',
      selectedTimeline: 'Cot moc noi bat'
    },
    intro: [
      'Minh la mot ky su thien ve backend dang song va lam viec tai Thanh pho Ho Chi Minh, Viet Nam.',
      'Loai he thong ma minh thich nhat la nhung he thong co trong luong van hanh thuc su: workflow phe duyet ma nguoi dung phu thuoc vao, backend marketplace phai dieu phoi nhieu thanh phan, pipeline phan tich bien hanh vi tho thanh thong tin co the su dung, va cac tinh nang AI can duoc dat vao san pham mot cach thuc te thay vi ton tai nhu demo tach biet.',
      'Do chinh la soi chi xuyen suot trong phan lon cong viec cua minh. Minh it quan tam den viec xay tinh nang don le hon la dinh hinh nen tang he thong ben duoi giup san pham dang tin cay, de hieu va co the mo rong theo thoi gian.'
    ],
    overview: [
      'Nen tang cua minh bat dau tu backend voi ASP.NET Core, sau do mo rong dan sang event-driven architecture, cloud deployment workflow, he thong analytics va tich hop AI theo huong thuc dung. Dieu ket noi cac mang do voi minh khong nam o cong nghe, ma nam o muc do trach nhiem ma chung dat ra. Khi mot he thong dong vao phe duyet, thanh toan, thong bao, ranh gioi ha tang hay quyet dinh tao boi may, backend khong con la lop vo hinh nua ma tro thanh noi niem tin san pham duoc xay dung.',
      'Mình hoc duoc nhieu nhat trong nhung moi truong ma business rules phuc tap, system boundary co y nghia, va do tin cay la mot phan cua user experience. Do la nhung du an buoc minh phai nang cap tu duy engineering judgement, khong chi don thuan la implementation.'
    ],
    focusAreas: [
      'He thong backend nhieu workflow, noi state, auditability va business rules quan trong khong kem viec giao tinh nang.',
      'Kien truc phan tan va cloud-native voi cac cong cu nhu Kafka, YARP, SignalR va dich vu serverless tren AWS.',
      'Applied AI trong boi canh san pham, dac biet khi model can duoc tich hop vao workflow dau-cuoi co the su dung duoc.',
      'Cac tich hop co y nghia van hanh tren thanh toan, thong bao, geolocation, media storage va analytics.',
      'Product engineering gan voi rang buoc thuc te thay vi dung lai o muc prototype ky thuat.'
    ],
    experienceSnapshot: [
      'Tai Amazon Web Services thong qua chuong trinh FCAJ, minh tham gia mot nen tang clickstream analytics ket hop ingestion, chuyen doi theo lich, ranh gioi truy cap du lieu noi bo va output san sang cho dashboard. Dieu de lai an tuong voi minh khong chi la AWS stack, ma con la ky luat tu duy ve pipeline nhu mot he thong phai an toan de van hanh, lap lai duoc khi deploy va de hieu voi nguoi su dung ket qua.',
      'Tai FPT Software, minh lam tren Claim Request System, mot nen tang workflow noi bo cho phe duyet tai chinh. Du an nay sharpen mot mat khac trong tu duy engineering cua minh: mo hinh hoa state transition can than, bien business rules thanh thu minh, va chuyen mot quy trinh van hanh thu cong thanh phan mem ma nhieu phong ban co the tin tuong.',
      'Qua cac du an ca nhan va du an nhom, minh tiep tuc di theo huong do. AlohaMarket day minh sau hon vao service boundary va event-driven design. EzyFix lam cho cac bai toan thanh toan, settlement va dieu phoi van hanh tro nen cu the hon. SnakeAid buoc minh suy nghi nghiem tuc ve cach AI nen ho tro mot workflow san pham thuc te thay vi dung ben ngoai nhu mot thu nghiem tach biet.'
    ],
    education: {
      paragraphs: [
        'Mình dang hoc nganh Ky thuat Phan mem tai Dai hoc FPT co so Thanh pho Ho Chi Minh, du kien tot nghiep vao thang 6/2026.',
        'Trong qua trinh do, minh cung xem chung chi la cach cuong co nen tang ve delivery, process va ky luat ky thuat, thay vi chi xem chung la credential.',
        'Mot so chung chi tieu bieu gom:'
      ],
      certifications: [
        'LFS167: Gioi thieu Jenkins - The Linux Foundation',
        'Project Management Principles and Practices Specialization - UC Irvine',
        'Java FullStack Developer Specialization - Board Infinity',
        'Software Development Lifecycle Specialization - University of Minnesota'
      ]
    },
    timeline: [
      {
        date: '2024-05',
        content:
          'Xay dung <strong>TTK Piano Center</strong>, mot du an Java web giai doan som giup minh co nen tang tot hon ve he thong da vai tro va tu duy backend co cau truc.'
      },
      {
        date: '2024-12',
        content:
          'Gia nhap <strong>FPT Software</strong> va tham gia Claim Request System, noi workflow modeling tro thanh mot phan trung tam trong cach minh nghi ve backend design.'
      },
      {
        date: '2025-05',
        content:
          'Lam viec tren cac he thong lon hon nhu <strong>AlohaMarket</strong> va <strong>VitaFlow</strong>, mo rong sang service boundary, layered architecture va operational workflow.'
      },
      {
        date: '2025-08',
        content:
          'Xay dung <strong>EzyFix</strong> va <strong>CellphoneZ</strong>, tien sau hon vao marketplace logic, payment handling va product delivery huong nguoi dung.'
      },
      {
        date: '2025-09',
        content:
          'Tham gia <strong>AWS FCAJ Program</strong> va giao mot nen tang clickstream analytics serverless, tu do tang hon su quan tam cua minh voi cloud-native systems va analytics pipeline.'
      },
      {
        date: '2025-11',
        content:
          'Tiep tuc phat trien <strong>SnakeAid</strong>, ket hop backend engineering voi AI-assisted healthcare workflow theo huong san pham ro rang hon.'
      }
    ]
  },
  projects: {
    title: 'Du an',
    intro: [
      'Nhung du an phu hop nhat voi the manh cua minh thuong xoay quanh workflow-heavy systems, distributed backends, cloud-native infrastructure va applied AI. Minh quan tam nhat den nhung du an ma backend architecture tac dong truc tiep den van hanh, do tin cay va niem tin cua nguoi dung.',
      'Neu ban muon trao doi ve mot co hoi lien quan den backend, cloud hoac product engineering, hay lien he qua GitHub hoac LinkedIn.'
    ],
    cta: 'Xem GitHub cua toi',
    headings: {
      flagship: 'Du an tieu bieu',
      other: 'Cac du an khac',
      whatTheseProjectsShow: 'Nhung du an nay the hien dieu gi'
    },
    groupTitles: {
      'devops-and-site-reliability': 'DevOps va Site Reliability',
      linux: 'Linux',
      'computer-vision-and-ml': 'Computer Vision va ML',
      'service-platforms': 'Nen tang dich vu',
      'mobile-apps-and-android': 'Ung dung mobile va Android',
      'student-productivity-and-edtech': 'Student Productivity va EdTech',
      'business-and-operations-systems': 'He thong nghiep vu va van hanh',
      'healthcare-platforms': 'Nen tang y te',
      'unity-games': 'Game Unity'
    },
    summaryBullets: [
      'Mình manh nhat khi bai toan lien quan den workflow, backend architecture va do phuc tap van hanh.',
      'Mình co the lam viec qua nhieu service boundary thay vi chi dung trong mot lop API hay UI.',
      'Mình thoai mai ket hop product delivery voi infrastructure, integration, data flow va AI feature.',
      'Mình uu tien nhung du an ma quyet dinh ky thuat co tac dong ro rang len reliability, transparency va maintainability.'
    ],
    tocTitle: 'DU AN',
    tocGroups: {
      flagship: 'Tieu bieu',
      other: 'Khac'
    }
  },
  links: {
    title: 'Lien ket',
    headings: {
      common: 'Lien ket thong thuong',
      special: 'Lien ket dac biet',
      apply: 'Dang ky lien ket'
    },
    intro: 'Danh sach duoc sap xep ngau nhien.',
    badStatus: 'Lien ket co trang thai xau',
    historyBook: 'Nhat ky lien ket',
    applyInfo: 'Thong tin trang web (bam de sao chep):',
    copied: 'Da sao chep',
    applyIntro:
      'Ban co the de lai binh luan hoac gui PR de xin them lien ket. Thong tin bo sung:',
    applyViaPr: 'gui PR',
    rules: [
      'Ban da dat link cua trang nay tren website cua minh',
      'Website cua ban dang hoat dong va co domain chinh thuc',
      'Co it nhat 5 bai viet goc va van con cap nhat trong nam gan day',
      'Noi dung khong vi pham phap luat'
    ],
    empty: 'Chua co gi o day.',
    applyTipLabels: {
      Name: 'Ten',
      Desc: 'Mo ta',
      Link: 'Lien ket',
      Avatar: 'Anh dai dien'
    }
  },
  docs: {
    title: 'Tai lieu',
    metaDescription: 'Trang tong hop tai lieu',
    back: 'Quay lai',
    heading: 'Tai lieu cua Nguyen Van Duy Khiem',
    sections: {
      themeDocumentation: 'Tai lieu theme',
      feedback: 'Phan hoi',
      news: 'Nguon tin RSS'
    },
    feedback:
      'Neu gap van de, ban co the xem GitHub Issues de tim ho tro tu cong dong.',
    editOnGitHub: 'Sua tren GitHub',
    tocTitle: 'TAI LIEU',
    tocCategories: {
      setup: 'Cai dat',
      integrations: 'Tich hop',
      advanced: 'Nang cao'
    }
  },
  search: {
    title: 'Tim kiem',
    metaDescription: 'Tim cac bai viet lien quan trong blog',
    intro: 'Nhap tu khoa hoac cum tu de tim trong blog.',
    disabled: 'Pagefind dang bi tat.'
  }
}

export function getSiteDictionary(locale: SiteLocale) {
  return locale === 'vi' ? deepMerge(en, vi) : en
}
