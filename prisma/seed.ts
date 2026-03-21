import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("ieum2024!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gnsa.app" },
    update: {},
    create: {
      email: "admin@gnsa.app",
      name: "관리자",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created:", admin.email);
  console.log("Admin password: ieum2024!");

  // Create initial invite token
  const initialToken = randomBytes(16).toString("hex");
  await prisma.inviteToken.upsert({
    where: { token: "ieum-initial-invite-token" },
    update: {},
    create: {
      token: "ieum-initial-invite-token",
      createdBy: admin.id,
      note: "초기 설정용 토큰",
    },
  });

  console.log("Initial invite token: ieum-initial-invite-token");

  // Create sample members
  const members = [
    {
      name: "김이음",
      role: "회장",
      bio: "이음 동아리를 이끌고 있습니다. gnsa.app 개발을 담당하고 있어요.",
      github: "https://github.com",
      email: "president@gnsa.app",
      year: 2023,
      order: 1,
      active: true,
    },
    {
      name: "이연결",
      role: "부회장",
      bio: "동아리 운영과 대외 활동을 담당합니다.",
      github: "https://github.com",
      year: 2023,
      order: 2,
      active: true,
    },
    {
      name: "박개발",
      role: "개발팀장",
      bio: "풀스택 개발을 맡고 있습니다. React와 Node.js를 주로 사용해요.",
      github: "https://github.com",
      year: 2024,
      order: 3,
      active: true,
    },
    {
      name: "최디자인",
      role: "디자인팀장",
      bio: "UI/UX 디자인을 담당합니다. Figma로 작업해요.",
      year: 2024,
      order: 4,
      active: true,
    },
    {
      name: "정부원",
      role: "부원",
      bio: "프론트엔드 개발에 관심이 많습니다.",
      year: 2025,
      order: 5,
      active: true,
    },
  ];

  for (const member of members) {
    await prisma.member.upsert({
      where: { id: member.name },
      update: {},
      create: member,
    });
  }

  console.log("Sample members created");

  // Create sample posts
  const tag1 = await prisma.tag.upsert({
    where: { name: "Next.js" },
    update: {},
    create: { name: "Next.js" },
  });

  const tag2 = await prisma.tag.upsert({
    where: { name: "gnsa.app" },
    update: {},
    create: { name: "gnsa.app" },
  });

  const tag3 = await prisma.tag.upsert({
    where: { name: "개발" },
    update: {},
    create: { name: "개발" },
  });

  await prisma.post.upsert({
    where: { slug: "introducing-ieum" },
    update: {},
    create: {
      title: "이음 동아리를 소개합니다",
      slug: "introducing-ieum",
      excerpt:
        "경남과학고 이음 동아리는 학교 서비스 개발과 IT 역량 강화를 목표로 활동하고 있습니다.",
      content: `# 이음 동아리를 소개합니다

이음(IEUM)은 경남과학고에서 활동하는 IT 개발 동아리입니다.

## 우리가 하는 일

저희 이음은 학교 학생들의 삶을 더 편리하게 만들기 위한 다양한 서비스를 개발하고 운영합니다.

### 주요 프로젝트: gnsa.app

**gnsa.app**은 경남과학고 학생들을 위한 종합 정보 플랫폼입니다. 급식, 시간표, 공지사항 등 학생들이 필요한 정보를 한 곳에서 확인할 수 있습니다.

## 활동 내용

- 웹 서비스 개발 (React, Next.js, Node.js)
- UI/UX 디자인 (Figma)
- 서버 운영 및 유지보수
- 해커톤 참가
- 스터디 및 세미나

## 동아리 가입

매년 신입부원을 모집합니다. 개발에 관심 있는 학생이라면 누구든 환영합니다!
`,
      category: "공지",
      published: true,
      authorId: admin.id,
      tags: {
        create: [{ tagId: tag3.id }],
      },
    },
  });

  await prisma.post.upsert({
    where: { slug: "gnsa-app-v2-launch" },
    update: {},
    create: {
      title: "gnsa.app v2.0 출시",
      slug: "gnsa-app-v2-launch",
      excerpt:
        "더 빠르고 편리해진 gnsa.app v2.0이 출시되었습니다. Next.js 14로 전면 리뉴얼했어요.",
      content: `# gnsa.app v2.0 출시

드디어 **gnsa.app v2.0**이 출시되었습니다! 🎉

## 무엇이 바뀌었나요?

### 기술 스택 업그레이드

기존 React + Express 구조에서 **Next.js 14** App Router 기반으로 전면 재개발했습니다.

\`\`\`
기존: React 18 + Express + MySQL
변경: Next.js 14 + Prisma + SQLite
\`\`\`

### 새로운 기능

1. **다크 모드** 지원
2. **PWA** 지원으로 모바일 앱처럼 사용 가능
3. 급식 메뉴 **영양 정보** 추가
4. 시간표 **개인화** 설정

### 성능 개선

- 페이지 로딩 속도 **60% 향상**
- Core Web Vitals 모두 **Good** 등급 달성

## 앞으로의 계획

v2.1에서는 캘린더 기능과 알림 시스템을 추가할 예정입니다.
`,
      category: "프로젝트",
      published: true,
      authorId: admin.id,
      tags: {
        create: [{ tagId: tag1.id }, { tagId: tag2.id }],
      },
    },
  });

  console.log("Sample posts created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
