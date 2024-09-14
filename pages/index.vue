<template>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Roominous Landing Page</title>
    </head>
    <body>
    
      <section class="hero">
        <img class="hero-image" src="https://for.stella.place/D1/d902c143-0de7-4701-b175-22b4502f173d.webp">
        <div class="hero-content">
          <h2>새로운 연결 통로, Roominous</h2>
          <p>당신의 모든 것을 요약하세요!</p>
          <a href="/room/@hyun1008@peacht.art" class="cta-button">데모 사이트</a>
        </div>
      </section>
    
      <section id="about" class="about">
        <h2>Roominous란?</h2>
        <p>가지고 계신 SNS와 사이트의 링크를 방을 꾸미듯 정리할 수 있는 서비스입니다.</p>
        <p>링크를 정리하고, 피드를 관리하고, 방을 방문하는 유저들과 채팅해 보세요.</p>
      </section>
    
      <section id="features" class="features">
        <h2>주요 기능</h2>
        <div class="feature-grid">
          <div class="feature-item">
            <h3>연결 통로 구축</h3>
            <p>소셜 링크로의 연결 통로를 만드세요.</p>
          </div>
          <div class="feature-item">
            <h3>소셜 인터랙션</h3>
            <p>방에서 친구들과 실시간으로 교류하세요.</p>
          </div>
          <div class="feature-item">
            <h3>경제 시스템</h3>
            <p>방에 머물며 얻은 재화로 아이템을 구매하세요.</p>
          </div>
        </div>
      </section>
    
      <section id="signup" class="signup">
        <h2>지금 가입하세요</h2>
        <p>Roominous에서 새로운 경험을 시작해보세요!</p>
        <a href="/signin" class="cta-button">연합우주 아이디로 로그인</a>
      </section>
    
      <footer>
        <p>© 2024 Roominous. All Rights Reserved.</p>
      </footer>
    </body>
    </html>
    
</template>
<script>
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'IBMPlexSansKR', sans-serif;
  line-height: 1.6;
  background-color: var(--bg);
  color: #333;
  overflow-y: unset;
}

nav ul {
  list-style: none;
  display: flex;
}

nav ul li {
  margin-left: 2rem;
}

nav ul li a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

.hero {
  color: #fff;
  text-align: center;
  padding: 5rem 2rem;
  overflow: hidden;
}

.hero-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    filter: brightness(0.5);
    position:absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero h2 {
  font-size: 3rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: white;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 2rem;
  background-color: var(--accent);
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  border-radius: 30px;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: var(--accent-light);
}

.about, .signup{
    background-color: white;
}

.about, .features, .signup {
  padding: 4rem 2rem;
  text-align: center;
}

.about h2, .features h2, .signup h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.about p {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.signup p {
    margin-bottom: 20px;
}

.features .feature-grid {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
}

.features .feature-item {
  background-color: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 30%;
}

.features .feature-item h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

footer {
  background-color: var(--bg);
  color: var(--fg);
  text-align: center;
  padding: 1rem 0;
}

</style>