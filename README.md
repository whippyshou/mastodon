<h1><picture>
  <source media="(prefers-color-scheme: dark)" srcset="./lib/assets/wordmark.dark.png?raw=true">
  <source media="(prefers-color-scheme: light)" srcset="./lib/assets/wordmark.light.png?raw=true">
  <img alt="Whippy Edition" src="./lib/assets/wordmark.light.png" height="100">
</picture></h1>

[![GitHub release](https://img.shields.io/github/release/whippyshou/mastodon.svg)][releases]

[releases]: https://github.com/whippyshou/mastodon/releases


**휘핑 에디션**은 **오리지널 캐릭터의 교류**를 목적으로 하는 **커뮤니티**를 위해 제공되는 오픈소스 네트워크 미디어 소프트웨어입니다. 휘핑 에디션은 Mastodon gGmbH에서 제공하는 오픈소스 소프트웨어인 Mastodon에서 파생되었으며 자유로운 수정 및 복제, 사용이 가능합니다. 

![whippy_Preview](./lib/assets/preview.png)

## Navigation

- [마스토돈 프로젝트 홈페이지 🐘](https://joinmastodon.org)
- [CAFE : WHIPPY CREAM <img alt="Whippy Edition" src="./lib/assets/Postype_Symbol-1.svg?raw=true" height="20"> ][postype]
- [Mastodon with modern birdsite-like UI 🐦](https://github.com/ronilaukkarinen/mastodon-bird-ui/)

[postype]:https://posty.pe/1no6yj

위의 링크에서 **휘핑 에디션**에 대한 좀 더 자세한 내용을 확인하실 수 있습니다. 

## Feature

마스토돈과 차별화되는 **휘핑에디션**의 특징은 크게 세가지로 나누어집니다.


#### 다이렉트 메시지(개인적인 멘션)의 타임라인 및 알림 분리
캐릭터 커뮤니티에서는 일반 툿과 DM의 용도가 분리되어 있습니다. 그렇기 때문에 DM과 일반 게시글이 혼재되어있는 타임라인과 알림창은 사용자에게 혼란을 야기할 수 있습니다. 

휘핑 에디션에서는 홈 타임라인과 계정 프로필에 DM이 필터링되어 나타나지 않습니다. 또한 알림창의 탭에 일반 멘션과 DM을 분리해 사용자는 필요에 따라 일반 멘션/DM 알림을 나누어 확인할 수 있습니다. 

#### 방문자(외부인)의 접근 차단 
캐릭터 커뮤니티는 폐쇄적인 성향을 띱니다. 대부분의 사용자는 자신의 게시물이 허가되지 않은 타인에게 노출되는 것을 꺼려합니다. 

휘핑 에디션 인스턴스에 올라오는 모든 게시물은 비등재(이하 ‘로컬’)/팔로워 공개로 게시되며, 타 서버의 퍼블릭 타임라인/타 도메인의 팔로워의 타임라인에 노출되지 않습니다. 

또한 사이트 방문자에게 계정의 게시물을 노출하지 않습니다. 휘핑 에디션의 모든 게시글들은 인스턴스의 가입자만이 접근할 수 있습니다. 


#### 커뮤니티에 적합한 UI 개선 

사용자간의 원활한 교류를 지원하기 위해 여러가지 추가 기능 및 편의성 패치를 진행하였습니다. 
- 커뮤니티의 테마에 맞춰 사이트의 테마 커스텀 가능 
- 관리자의 타 계정간의 DM 확인 기능 추가 
- 사이트 내 도메인 노출 최소화 
- 계정의 표시 이름 강조
- 게시글의 공개 범위와 관계없이 답글 갯수 표시 
- 타임라인에 노출되는 미디어 썸네일의 최대 높이 제한
- 계정의 미디어 모아보기 타임라인 썸네일 클릭시 해당 게시글 타래로 이동
- 게시글의 공개 범위와 관계없이 방문자에게 계정의 바이오를 포함한 계정 게시글 비공개

그 외에 자잘한 UI의 개선이 있습니다. 


## Deployment

### Tech stack

- **Ruby on Rails** 는 REST API and 기타 웹페이지를 구동합니다. 
- **React.js** 와 Redux는 인터페이스의 동적 파트에 사용됩니다. 
- **Node.js** 는 streaming API를 구동합니다. 

### Requirements

- **PostgreSQL** 12.16
- **Redis** 5.0.7
- **Ruby** 3.2.2
- **Node.js** 16.20.2

기입되어있는 버전은 휘핑 에디션 설치 당시의 버전으로, 휘핑 에디션은 2023년 10월 11일 릴리즈된 마스토돈 v4.2.1을 기반으로 합니다. 자세한 내용은 [마스토돈 홈페이지 설치 가이드](https://docs.joinmastodon.org/admin/install/)를 참고해주세요.


## Contributing

**휘핑에디션**의 기반이 되는 마스토돈은 **AGPLv3** 라이선스가 부여된 **프리 오픈소스 소프트웨어**입니다. 자유롭게 버그의 수정, 혹은 기능의 추가 및 제거가 가능합니다. 단, 모든 소스코드는 네트워크상의 사용자에게 무료로 공개, 제공되어야 하며 휘핑 에디션 또한 하단의 **AGPLv3** 라이선스를 따릅니다. 



## Lisence

Copyright (C) 2016-2023 Eugen Rochko & other Mastodon contributors (see [AUTHORS.md](AUTHORS.md))

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
