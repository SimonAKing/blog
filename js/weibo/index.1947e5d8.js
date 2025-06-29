(()=>{var e={1060:function(e,t,i){"use strict";var n=i(2676),o=i(5271),r=i(8751),a=i(5045),s=i(1363),l=i(2686);let d={token:["9c48ed2297d7d9bf9447","6de723dbf1a6e4adeacd"],owner:"SimonAKing",repo:"weibo",pageSize:6,offsetTop:1,avatar:"https://cdn.jsdelivr.net/gh/SimonAKing/images/blog/avatar.jpg",clientID:"694df1779e48d5a450d3",clientSecret:"23420dd29f671adc5107a5565ed47f655f8e1260",autoProxy:"https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token"};i(3052);var c=i(4767);let p=e=>c.Z.create({baseURL:"https://api.github.com/",headers:{Accept:"application/json",Authorization:`bearer ${e}`}}),h=p(d.token.join("")),u=e=>{let t=`
  query getIssues($owner: String!, $repo: String!, $cursor: String, $pageSize: Int!) {
    repository(owner: $owner, name: $repo) {
      issues(first: $pageSize, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}, filterBy: {createdBy: $owner, states: OPEN}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          number
          createdAt
          bodyHTML
          reactions(first: 100) {
            totalCount
            nodes {
              content
              user {
                login
              }
            }
          }
          comments(first: 1) {
            totalCount
          }
          labels(first: 1) {
            nodes {
              name
              color
            }
          }
        }
      }
    }
  }
  `;return null===e.cursor&&Reflect.deleteProperty(e,"cursor"),{operationName:"getIssues",query:t,variables:e}},m=e=>{let{owner:t,repo:i}=e;return{query:`
    query {
      repository(owner: "${t}", name: "${i}") {
        labels(first: 100) {
          nodes {
            name
            color
          }
        }
      }
    }
  `}},g=async(e,t,i)=>{let n=`
    mutation AddReaction($subjectId: ID!, $content: ReactionContent!) {
      addReaction(input: {subjectId: $subjectId, content: $content}) {
        reaction {
          content
          user {
            login
          }
        }
      }
    }
  `;return e.post("/graphql",{query:n,variables:{subjectId:t,content:i}})},x=async(e,t,i)=>{let n=`
    mutation RemoveReaction($subjectId: ID!, $content: ReactionContent!) {
      removeReaction(input: {subjectId: $subjectId, content: $content}) {
        reaction {
          content
          user {
            login
          }
        }
      }
    }
  `;return e.post("/graphql",{query:n,variables:{subjectId:t,content:i}})},f=e=>{let{owner:t,repo:i,issueNumber:n}=e;return{query:`
    query {
      repository(owner: "${t}", name: "${i}") {
        issue(number: ${n}) {
          comments(first: 100, orderBy: {field: UPDATED_AT, direction: ASC}) {
            totalCount
            nodes {
              id
              author {
                login
                avatarUrl
              }
              bodyHTML
              createdAt
              updatedAt
              reactions(first: 100) {
                totalCount
                nodes {
                  content
                  user {
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  `}},b=async(e,t,i)=>{let n=`
    mutation AddComment($subjectId: ID!, $body: String!) {
      addComment(input: {subjectId: $subjectId, body: $body}) {
        commentEdge {
          node {
            id
            author {
              login
              avatarUrl
            }
            bodyHTML
            createdAt
            updatedAt
          }
        }
      }
    }
  `;return e.post("/graphql",{query:n,variables:{subjectId:t,body:i}})},v=async e=>(await c.Z.get("https://api.github.com/user",{headers:{Authorization:`bearer ${e}`}})).data,w=async e=>(await c.Z.post(d.autoProxy,{client_id:d.clientID,client_secret:d.clientSecret,code:e})).data,y=async(e,t,i)=>{let n=`
    mutation UpdateIssueComment($commentId: ID!, $body: String!) {
      updateIssueComment(input: {id: $commentId, body: $body}) {
        issueComment {
          id
          author {
            login
            avatarUrl
          }
          bodyHTML
          createdAt
          updatedAt
        }
      }
    }
  `;return e.post("/graphql",{query:n,variables:{commentId:t,body:i}})},j=async(e,t)=>{let i=`
    mutation DeleteIssueComment($commentId: ID!) {
      deleteIssueComment(input: {id: $commentId}) {
        clientMutationId
      }
    }
  `;return e.post("/graphql",{query:i,variables:{commentId:t}})};var k=i(692),$=i(8773),C=i(3115),z=i(6887),S=i(5986);let Z=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.location.search;if(!e)return{};let t="?"===e[0]?e.substring(1):e,i={};return t.split("&").forEach(e=>{let[t,n]=e.split("=");t&&(i[decodeURIComponent(t)]=decodeURIComponent(n))}),i},E=(e,t,i)=>{let n,o,r,a,s=0;i||(i={});let l=function(){s=!1===i.leading?0:new Date().getTime(),a=null,r=e.apply(n,o),a||(n=o=null)};return function(){n=this;let d=new Date().getTime();s||!1!==i.leading||(s=d);let c=t-(d-s);return c<=0||c>t?(a&&(clearTimeout(a),a=null),s=d,r=e.apply(n,o),a||(n=o=null)):a||!1===i.trailing||(a=setTimeout(l,c)),r}},A=e=>e&&0!==e.length?e[0]:{name:"default",color:"1da1f2"},T=(e,t)=>e.map(e=>{let{id:i,number:n,createdAt:o,bodyHTML:r,reactions:a,comments:s,labels:l}=e,d=a.nodes.filter(e=>"HEART"===e.content),c=d.length,p=!!t&&d.some(e=>e.user.login===t);return{id:i,number:n,createdAt:o,bodyHTML:r,reactions:{totalCount:a.totalCount,userReacted:p,heartCount:c},comments:s.totalCount,label:A(l.nodes)}}),_=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"zh",i=new Date(e),n=new Date,o=["zh","zh-CN"].includes(t)?z.U:S._,r=(0,k.B)(i,n,{addSuffix:!0,locale:o});if(o===z.U){if(r.includes("秒")||r.includes("分钟"))return r;if(r.includes("小时")||r.includes("昨天"))return(0,$.l)(i,n,{locale:o});if(r.includes("天"))return r}else{if(r.includes("second")||r.includes("minute"))return r;if(r.includes("hour")||r.includes("yesterday"))return(0,$.l)(i,n,{locale:o});if(r.includes("day"))return r}return(0,C.WU)(i,"yyyy-MM-dd",{locale:o})},M=e=>(299*parseInt(e.substr(0,2),16)+587*parseInt(e.substr(2,2),16)+114*parseInt(e.substr(4,2),16))/1e3>=128?"black":"white",I=e=>Object.keys(e).map(t=>`${t}=${encodeURIComponent(e[t]||"")}`).join("&"),L=e=>{let t={width:Math.max(Math.floor(.4*window.outerWidth),400),height:Math.max(Math.floor(.4*window.outerHeight),400),left:0,top:0};t.left=Math.floor(window.screenX+(window.outerWidth-t.width)/2),t.top=Math.floor(window.screenY+(window.outerHeight-t.height)/3);let i=-1!==e.indexOf("?")?"&":"?",n=`${e}${i}`,o=`toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
    width=${t.width},height=${t.height},
    left=${t.left},top=${t.top}`,r=window.open(n,"Gwitter OAuth Application",o),a="addEventListener"in window?"addEventListener":"attachEvent",s=window[a],l="attachEvent"===a?"onmessage":"message",d=(e,t,i)=>{if(r&&r.close(),"string"!=typeof e.data)return;let{result:n,error:o}=JSON.parse(e.data);o&&i(o),n||i("Unauthorised");let a=n.split("&").find(e=>e.startsWith("access_token="));a&&a.includes("=")||i("Unauthorised"),t(a.split("=")[1])};return new Promise((e,t)=>{s(l,i=>d(i,e,t),!1)})},O=e=>{let t=document.createElement("div");return t.innerHTML=e,t.querySelectorAll("a").forEach(e=>{e.setAttribute("target","_blank"),e.setAttribute("rel","noopener noreferrer")}),t.innerHTML},P=a.Z.span`
	display: inline-block;
  line-height: 1;
  padding: 5px 6px;
  font-size: 0.9em;
  font-weight: 600;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 rgba(27, 31, 35, 0.12);
  background-color: #${e=>e.bgColor};
  color: ${e=>M(e.bgColor)};
`,R=e=>{let{name:t,color:i,style:o}=e;return(0,n.jsx)(P,{style:o,bgColor:i,children:t})},H=["dependencies"],D=()=>{let[e,t]=(0,o.useState)(null),{t:i}=(0,l.$G)();return(0,o.useEffect)(()=>{new Collapse(document.querySelector(".collapse"),{accordion:!0}).init(),(async()=>{try{var e,i,n,o;let{owner:r,repo:a}=d,s=await h.post("/graphql",m({owner:r,repo:a})),l=null==s||null==(o=s.data)||null==(n=o.data)||null==(i=n.repository)||null==(e=i.labels)?void 0:e.nodes;if(Array.isArray(l)){let e=l.filter(e=>!H.includes(e.name));t(e)}}catch(e){console.error("Failed to fetch labels:",e)}})()},[]),(0,n.jsxs)("div",{className:"about-container collapse",children:[(0,n.jsx)("div",{className:"about-title",children:i("about.title")}),(0,n.jsxs)("details",{children:[(0,n.jsx)("summary",{children:i("about.gwitter.title")}),(0,n.jsx)("div",{children:(0,n.jsx)("div",{className:"details-styling",children:(0,n.jsx)("p",{children:i("about.gwitter.description")})})})]}),(0,n.jsxs)("details",{children:[(0,n.jsx)("summary",{children:i("about.content.title")}),(0,n.jsx)("div",{children:(0,n.jsxs)("div",{className:"details-styling",children:[(0,n.jsx)("p",{children:i("about.content.categories",{count:(null==e?void 0:e.length)||0})}),(0,n.jsx)("div",{children:null==e?void 0:e.map((e,t)=>(0,n.jsx)(R,{style:{margin:"6px"},name:e.name,color:e.color},t))})]})})]}),(0,n.jsxs)("details",{children:[(0,n.jsx)("summary",{children:i("about.subscription.title")}),(0,n.jsx)("div",{children:(0,n.jsx)("div",{className:"details-styling",children:(0,n.jsxs)("ul",{children:[(0,n.jsxs)("li",{children:[(0,n.jsx)("code",{children:i("about.subscription.watch")}),"\xa0",(0,n.jsx)("a",{href:"https://github.com/SimonAKing/weibo",target:"_blank",rel:"noopener noreferrer",children:i("about.subscription.repo")})]}),(0,n.jsxs)("li",{children:[(0,n.jsx)("code",{children:i("about.subscription.join")}),"\xa0",(0,n.jsx)("a",{href:"https://thinking.simonaking.com/#ru-kou",target:"_blank",rel:"noopener noreferrer",children:i("about.subscription.wechat")})]}),(0,n.jsxs)("li",{children:[(0,n.jsx)("code",{children:i("about.subscription.join")}),"\xa0",(0,n.jsx)("a",{href:"https://t.me/Simon_AKing",target:"_blank",rel:"noopener noreferrer",children:i("about.subscription.telegram")})]})]})})})]})]})};var N=i(2254);let q=a.Z.div`
  position: relative;
  width: 100%;
  margin-top: 3em;
  @media (orientation: landscape) and (max-height: 500px) {
    margin-top: 0.8em;

    .closing-message {
      padding: 0.8em;
      margin: 0.8em auto;
      transform: rotate(-1deg);
    }

    .code-block {
      max-height: 180px;
    }

    .button-container {
      margin-top: 0.6em;
    }
  }
`,V=a.Z.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`,F=a.Z.div`
  text-align: center;
  padding: clamp(1.2em, 3vw, 2em) clamp(0.8em, 2vw, 1.5em);
  margin: clamp(1.5em, 4vw, 2.5em) auto;
  width: 85%;
  max-width: 600px;
  border-radius: clamp(6px, 1.5vw, 12px);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 2;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transform: rotate(-3deg) perspective(800px);
  transform-style: preserve-3d;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.5) 38%,
      rgba(255, 255, 255, 0.5) 40%,
      rgba(255, 255, 255, 0) 48%
    );
    background-size: 200% 100%;
    background-position: 100% 0;
    opacity: 0;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease,
      background-position 1.5s ease;
    z-index: -1;
  }

  &:hover {
    transform: rotate(0deg) perspective(800px) translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);

    &:before {
      opacity: 1;
      background-position: -100% 0;
    }

    .code-block {
      transform: translateZ(20px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .button-container {
      transform: translateZ(30px);
    }
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 1.2em 0.8em;
    margin: 1.2em auto;
    transform: rotate(-2deg);
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 1em 0.7em;
    margin: 0.8em auto;
    border-radius: 8px;
    transform: rotate(-1deg);
  }
`,G=a.Z.div`
  background: #282c34;
  color: #abb2bf;
  border-radius: 8px;
  padding: clamp(0.6em, 1.5vw, 1em);
  font-family: monospace;
  font-size: clamp(0.75em, 1vw, 0.9em);
  text-align: left;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  overflow: auto;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 6px;
    font-size: 0.8em;
  }

  @media (max-width: 480px) {
    font-size: 0.75em;
    padding: 0.6em 0.4em;
    border-radius: 4px;
    max-height: 250px;
    white-space: pre-wrap;
    word-break: break-word;
  }
`,U=a.Z.span`
  display: block;
  line-height: 1.4;

  @media (max-width: 480px) {
    line-height: 1.3;
    margin-bottom: 0.2em;
  }
`,B=a.Z.span`
  color: #c678dd;
`,Y=a.Z.span`
  color: #61afef;
`,J=a.Z.span`
  color: #98c379;
`,W=a.Z.span`
  color: #7d8799;
`,K=a.Z.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.4em, 1.5vw, 0.8em);
  margin-top: clamp(0.8em, 2vw, 1.2em);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  @media (max-width: 480px) {
    flex-direction: column;
    width: 90%;
    margin: 0.8em auto 0;
    gap: 0.4em;
  }
`,X=a.Z.button`
  padding: clamp(0.5em, 1.2vw, 0.7em) clamp(1.2em, 2.5vw, 2em);
  font-size: clamp(0.7em, 0.9vw, 0.9em);
  font-weight: 500;
  color: white;
  background-color: #ff5f6d;
  background: linear-gradient(to right, #ff5f6d, #ffc371);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 95, 109, 0.4);
  margin: 0.4em;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 7px 20px rgba(255, 95, 109, 0.5);

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: shine 1.5s ease-in-out;
    }
  }

  @keyframes shine {
    0% {
      left: -100%;
    }

    100% {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(1);
    box-shadow: 0 5px 15px rgba(255, 95, 109, 0.4);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 0.6em 1.5em;
    font-size: 0.85em;
  }

  @media (max-width: 480px) {
    width: 100%;
    margin: 0.2em 0;
    padding: 0.6em 1em;
    border-radius: 30px;
  }
`,Q=()=>{let{t:e}=(0,l.$G)(),t=(0,o.useRef)(null),i=(0,o.useRef)(null),r=()=>{(0,N.E)()};return(0,o.useEffect)(()=>{let e=new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting&&(r(),e.disconnect())})},{threshold:.5});return t.current&&e.observe(t.current),()=>{t.current&&e.disconnect()}},[]),(0,n.jsxs)(q,{ref:t,children:[(0,n.jsx)(V,{ref:i}),(0,n.jsxs)(F,{children:[(0,n.jsx)(G,{children:(0,n.jsxs)("code",{children:[(0,n.jsxs)(U,{delay:.1,children:[(0,n.jsx)(B,{children:"function"}),(0,n.jsx)(Y,{children:" sayGoodbye"}),"() ","{"]}),(0,n.jsxs)(U,{delay:.2,children:["\xa0\xa0",(0,n.jsx)(B,{children:"const"})," message =",(0,n.jsxs)(J,{children:['"',e("egg.message"),'"']}),";"]}),(0,n.jsxs)(U,{delay:.3,children:["\xa0\xa0",(0,n.jsx)(B,{children:"const"})," hope =",(0,n.jsxs)(J,{children:['"',e("egg.hope"),'"']}),";"]}),(0,n.jsxs)(U,{delay:.4,children:["\xa0\xa0",(0,n.jsx)(Y,{children:"console.log"}),"(message, hope);"]}),(0,n.jsxs)(U,{delay:.5,children:["\xa0\xa0",(0,n.jsx)(W,{children:e("egg.comment")})]}),(0,n.jsx)(U,{delay:.6,children:"}"}),(0,n.jsxs)(U,{delay:.7,children:[(0,n.jsx)(Y,{children:"sayGoodbye"}),"();"]})]})}),(0,n.jsx)(K,{children:(0,n.jsx)(X,{onClick:r,children:e("egg.runCode")})})]})]})};i(4297);var ee=i(769),et=i(4487);let ei=(0,o.createContext)(void 0),en=()=>{let e=(0,o.useContext)(ei);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e},eo=e=>{let{children:t}=e,[i,r]=(0,o.useState)(!1),[a,s]=(0,o.useState)(null),[l,c]=(0,o.useState)(null),[p,h]=(0,o.useState)(!0);(0,o.useEffect)(()=>{let e=localStorage.getItem("github_token"),t=localStorage.getItem("github_user");e&&t&&(c(e),s(JSON.parse(t)),r(!0)),h(!1)},[]);let u=async e=>{h(!0);try{let t=await v(e),i={login:t.login,avatarUrl:t.avatar_url};c(e),s(i),r(!0),localStorage.setItem("github_token",e),localStorage.setItem("github_user",JSON.stringify(i))}catch(e){console.error("Auth callback error:",e)}finally{h(!1)}};return(0,n.jsx)(ei.Provider,{value:{isAuthenticated:i,user:a,token:l,isLoading:p,login:()=>{let e={client_id:d.clientID,redirect_uri:window.location.href,scope:"public_repo"},t=`https://github.com/login/oauth/authorize?${I(e)}`;h(!0),L(t).then(e=>{u(e)}).catch(e=>{console.error("Login error:",e),h(!1)})},logout:()=>{c(null),s(null),r(!1),h(!1),localStorage.removeItem("github_token"),localStorage.removeItem("github_user")}},children:t})};var er=i(967);let ea=a.Z.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e1e8ed;
  padding: 12px;
  transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease;
  overflow: hidden;
  max-height: ${e=>e.$isExpanded?"500px":"80px"};
  will-change: max-height;
  contain: layout;

  &:focus-within {
    border-color: #1d9bf0;
  }
`,es=a.Z.textarea`
  width: 100%;
  min-height: ${e=>e.$isExpanded?"60px":"40px"};
  padding: 0;
  border: none;
  font-size: 14px;
  line-height: 1.3125;
  resize: vertical;
  background: transparent;
  color: #0f1419;
  transition: min-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: min-height;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #536471;
  }
`,el=a.Z.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e1e8ed;
  opacity: ${e=>+!!e.$isExpanded};
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${e=>e.$isExpanded?"auto":"none"};
  will-change: opacity;
`,ed=a.Z.button`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  border: none;
  min-width: 70px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${e=>"primary"===e.variant?`
    background: #1d9bf0;
    color: white;

    &:hover:not(:disabled) {
      background: #1a8cd8;
    }

    &:disabled {
      background: #8ecdf8;
      cursor: not-allowed;
    }
  `:`
    background: transparent;
    color: #0f1419;
    border: 1px solid #cfd9de;

    &:hover {
      background: #f7f9fa;
      border-color: #8b98a5;
    }
  `}
`,ec=e=>{let{onSubmit:t,onCancel:i,initialValue:r="",placeholder:a,submitText:s,showCancel:d=!1,isExpanded:c=!1}=e,{t:p}=(0,l.$G)(),[h,u]=(0,o.useState)(r),[m,g]=(0,o.useState)(!1),[x,f]=(0,o.useState)(!1),b=(0,o.useRef)(null),v=async()=>{if(h.trim()&&!m){g(!0);try{await t(h.trim()),u("")}catch(e){console.error("Failed to submit comment:",e)}finally{g(!1)}}},w=c||x||h.trim().length>0;return(0,n.jsxs)(ea,{$isExpanded:w,children:[(0,n.jsx)(es,{ref:b,value:h,onChange:e=>u(e.target.value),placeholder:a||p("comments.placeholder"),disabled:m,onFocus:()=>{f(!0)},onBlur:()=>{setTimeout(()=>{h.trim()||f(!1)},150)},$isExpanded:w}),(0,n.jsxs)(el,{$isExpanded:w,children:[d&&(0,n.jsx)(ed,{variant:"secondary",onClick:()=>{u(r),f(!1),null==i||i()},children:p("comments.cancel")}),(0,n.jsx)(ed,{variant:"primary",onClick:v,disabled:!h.trim()||m,children:m?p(d?"comments.saving":"comments.adding"):s||p("comments.add")})]})]})},ep=a.Z.div`
  max-height: ${e=>e.isVisible?"85vh":"0"};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: ${e=>e.isVisible?"1px solid #e1e8ed":"none"};
  margin-top: ${e=>e.isVisible?"16px":"0"};
  background: white;
  will-change: max-height;
  contain: layout style;

  @media (max-width: 768px) {
    max-height: ${e=>e.isVisible?"75vh":"0"};
  }

  @media (max-width: 479px) {
    max-height: ${e=>e.isVisible?"65vh":"0"};
  }
`,eh=a.Z.div`
  opacity: ${e=>e.isVisible?"1":"0"};
  transform: ${e=>e.isVisible?"translateY(0)":"translateY(-8px)"};
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)
      ${e=>e.isVisible?"0.1s":"0s"},
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)
      ${e=>e.isVisible?"0.1s":"0s"};
  will-change: opacity, transform;
  padding: 16px 0 0;
  contain: layout style;
`,eu=a.Z.div`
  max-height: calc(85vh - 220px);
  overflow-y: auto;
  padding-right: 4px;

  @media (max-width: 768px) {
    max-height: calc(75vh - 200px);
  }

  @media (max-width: 479px) {
    max-height: calc(65vh - 180px);
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d9e0;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #aab8c2;
  }
`,em=a.Z.div`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f7f9fa;
  /* transition: background-color 0.2s ease; */

  &:hover {
    background-color: #f7f9fa;
    .markdown-body {
      background-color: #f7f9fa;
    }
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 4px;
  }
`,eg=a.Z.img`
  width: 2em;
  height: 2em;
  border-radius: 50%;
  flex-shrink: 0;

  @media (max-width: 479px) {
    width: 1.5em;
    height: 1.5em;
  }
`,ex=a.Z.div`
  flex: 1;
  min-width: 0;
  position: relative;
`,ef=a.Z.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
`,eb=a.Z.a`
  font-weight: 700;
  color: #132850;
  font-size: 15px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`,ev=a.Z.span`
  color: #a1a1a1;
  text-shadow:
    #d9d9d9 0 0 1px,
    #fffffb 0 0 1px,
    #fffffb 0 0 2px;
  font-size: 0.9em;

  &::before {
    content: '·';
    margin: 0 4px;
  }
`,ew=a.Z.div`
  color: #333;
  /* line-height: 1.3125; */
  word-wrap: break-word;
  margin-bottom: 12px;
  font-size: 1em;
  letter-spacing: 0.2px;

  &.markdown-body {
    font-size: 1em;
  }
`,ey=a.Z.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
`,ej=a.Z.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  height: 28px;
  min-width: 28px;

  ${e=>"edit"===e.variant?`
    color: #1d9bf0;
    &:hover {
      background: rgba(29, 155, 240, 0.1);
    }
  `:"delete"===e.variant?`
    color: #f4212e;
    &:hover {
      background: rgba(244, 33, 46, 0.1);
    }
  `:`
    color: #536471;
    &:hover {
      background: #f7f9fa;
    }
  `}

  svg {
    width: 14px;
    height: 14px;
  }
`,ek=(0,a.Z)(em)`
  &:hover {
    background-color: #f7f9fa;
    .markdown-body {
      background-color: #f7f9fa;
    }

    .comment-actions {
      opacity: 1;
    }
  }
`,e$=a.Z.div`
  text-align: center;
  color: #657786;
  padding: 32px 20px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid #e1e8ed;
    border-top: 2px solid #1d9bf0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`,eC=a.Z.div`
  padding: 0 16px;
  padding-bottom: ${e=>e.isVisible?"16px":"0"};
  max-height: ${e=>e.isVisible?"200px":"0"};
  overflow: hidden;
  transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: max-height;
  contain: layout;
`;a.Z.span`
  color: #536471;
  font-size: 13px;
  font-weight: 400;
  margin-left: 4px;
`;let ez=a.Z.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: ${e=>e.isOpen?"1":"0"};
  visibility: ${e=>e.isOpen?"visible":"hidden"};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
`,eS=a.Z.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 360px;
  width: 90%;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: ${e=>e.isOpen?"scale(1) translateY(0)":"scale(0.95) translateY(-8px)"};
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
`,eZ=a.Z.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f1419;
  line-height: 1.3;
`,eE=a.Z.p`
  margin: 0 0 20px 0;
  font-size: 15px;
  color: #536471;
  line-height: 1.4;
`,eA=a.Z.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`,eT=a.Z.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 70px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${e=>"danger"===e.variant?`
    background: #f4212e;
    color: white;

    &:hover:not(:disabled) {
      background: #dc1c2a;
    }

    &:disabled {
      background: #f7a1a8;
      cursor: not-allowed;
    }
  `:`
    background: transparent;
    color: #0f1419;
    border: 1px solid #cfd9de;

    &:hover {
      background: #f7f9fa;
      border-color: #8b98a5;
    }
  `}
`,e_=e=>{let{issueNumber:t,issueId:i,isVisible:r,commentCount:a,onCommentCountChange:s}=e,{t:c,i18n:u}=(0,l.$G)(),{isAuthenticated:m,user:g,token:x}=en(),[v,w]=(0,o.useState)([]),[k,$]=(0,o.useState)(!1),[C,z]=(0,o.useState)(!1),[S,Z]=(0,o.useState)(null),[E,A]=(0,o.useState)(null),[T,M]=(0,o.useState)(!1);(0,o.useEffect)(()=>{r&&!C&&I()},[r,C]),(0,o.useEffect)(()=>{if(E){let e=()=>{A(null)};return window.addEventListener("scroll",e,{passive:!0}),document.addEventListener("scroll",e,{passive:!0}),()=>{window.removeEventListener("scroll",e),document.removeEventListener("scroll",e)}}},[E]);let I=async()=>{$(!0);try{let e=(await h.post("/graphql",f({owner:d.owner,repo:d.repo,issueNumber:t}))).data.data.repository.issue.comments.nodes;w(e),z(!0)}catch(e){console.error("Failed to load comments:",e)}finally{$(!1)}},L=async e=>{if(!m||!x)throw Error(c("interaction.loginRequired"));try{let t=p(x),n=(await b(t,i,e)).data.data.addComment.commentEdge.node;w(e=>{let t=[...e,n];return null==s||s(t.length),t})}catch(e){throw console.error("Failed to add comment:",e),Error(c("comments.addFailed"))}},P=async(e,t)=>{if(!m||!x)throw Error(c("interaction.loginRequired"));try{let i=p(x),n=(await y(i,e,t)).data.data.updateIssueComment.issueComment;w(t=>t.map(t=>t.id===e?n:t)),Z(null)}catch(e){throw console.error("Failed to update comment:",e),Error(c("comments.updateFailed"))}},R=async e=>{if(m&&x){M(!0);try{let t=p(x);await j(t,e),w(t=>{let i=t.filter(t=>t.id!==e);return null==s||s(i.length),i}),A(null)}catch(e){console.error("Failed to delete comment:",e)}finally{M(!1)}}},H=e=>{A(e)},D=()=>{A(null)},N=e=>m&&g&&e.author.login===g.login,q=e=>{let t=document.createElement("div");return t.innerHTML=e,t.textContent||t.innerText||""};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(ep,{isVisible:r,children:(0,n.jsxs)(eh,{isVisible:r,children:[(0,n.jsx)(eC,{isVisible:r,children:(0,n.jsx)(ec,{onSubmit:L,placeholder:c("comments.placeholder"),submitText:c("comments.add")})}),k&&a>0&&(0,n.jsx)(e$,{children:c("comments.loading")}),!k&&v.length>0&&(0,n.jsx)(eu,{children:v.map(e=>(0,n.jsxs)(ek,{children:[(0,n.jsx)(eg,{src:e.author.avatarUrl,alt:e.author.login}),(0,n.jsxs)(ex,{children:[(0,n.jsxs)(ef,{children:[(0,n.jsx)(eb,{href:`https://github.com/${e.author.login}`,target:"_blank",rel:"noopener noreferrer",children:e.author.login}),(0,n.jsx)(ev,{children:_(e.createdAt,u.language)})]}),S===e.id?(0,n.jsx)(ec,{onSubmit:t=>P(e.id,t),onCancel:()=>Z(null),initialValue:q(e.bodyHTML),submitText:c("comments.save"),showCancel:!0}):(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(ew,{className:"markdown-body",dangerouslySetInnerHTML:{__html:O(e.bodyHTML)}}),N(e)&&(0,n.jsxs)(ey,{className:"comment-actions",children:[(0,n.jsx)(ej,{variant:"edit",onClick:()=>Z(e.id),title:c("comments.edit"),children:(0,n.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:(0,n.jsx)("path",{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"})})}),(0,n.jsx)(ej,{variant:"delete",onClick:()=>H(e.id),title:c("comments.delete"),children:(0,n.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:(0,n.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"})})})]})]})]})]},e.id))})]})}),E&&(0,er.createPortal)((0,n.jsx)(ez,{isOpen:!!E,onClick:D,children:(0,n.jsxs)(eS,{isOpen:!!E,onClick:e=>e.stopPropagation(),children:[(0,n.jsx)(eZ,{children:c("comments.confirmDeleteTitle")}),(0,n.jsx)(eE,{children:c("comments.confirmDeleteMessage")}),(0,n.jsxs)(eA,{children:[(0,n.jsx)(eT,{variant:"cancel",onClick:D,children:c("comments.cancel")}),(0,n.jsx)(eT,{variant:"danger",onClick:()=>E&&R(E),disabled:T,children:T?c("comments.deleting"):c("comments.delete")})]})]})}),document.body)]})},eM="#536471",eI="#f91880",eL="#1d9bf0",eO="rgba(249, 24, 128, 0.1)",eP="rgba(29, 161, 242, 0.1)",eR=(0,ee.F4)`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
`,eH=(0,ee.F4)`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--particle-x), var(--particle-y)) scale(0) rotate(var(--particle-rotation));
    opacity: 0;
  }
`,eD=a.Z.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${e=>e.size};
  height: ${e=>e.size};
  background-color: ${e=>"circle"===e.shape?e.color:"transparent"};
  border-radius: ${e=>"circle"===e.shape?"50%":"0"};
  pointer-events: none;
  opacity: 0;
  transform-origin: center;
  transform: translate(-50%, -50%) scale(${e=>e.initialScale})
    rotate(${e=>e.initialRotation});
  animation: ${eH} ${e=>e.duration} ease-out forwards;
  animation-delay: ${e=>e.delay};
  --particle-x: ${e=>e.x};
  --particle-y: ${e=>e.y};
  --particle-rotation: ${e=>180*Math.random()-90}deg;

  ${e=>"heart"===e.shape&&`
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: calc(${e.size} / 2);
      top: 0;
      width: calc(${e.size} / 2);
      height: ${e.size};
      background: ${e.color};
      border-radius: calc(${e.size} / 2) calc(${e.size} / 2) 0 0;
      transform: rotate(-45deg);
      transform-origin: 0 100%;
    }
    &::after {
      left: 0;
      transform: rotate(45deg);
      transform-origin: 100% 100%;
    }
  `}
`,eN=a.Z.div`
  display: flex;
  flex-direction: column;
  /* margin-top: 10px; */
`,eq=a.Z.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  margin-left: -8px;
`,eV=a.Z.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  overflow: hidden;
  transition:
    color 0.2s,
    opacity 0.2s,
    transform 0.2s;
  opacity: ${e=>+!!e.$isVisible};
  transform: ${e=>e.$isVisible?"scale(1)":"scale(0.8)"};
  pointer-events: ${e=>e.$isVisible?"auto":"none"};
`,eF=a.Z.button`
  display: flex;
  align-items: center;
  color: ${eM};
  background: none;
  border: none;
  padding: 8px 0px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  font-weight: 400;
  border-radius: 20px;
  min-width: 0;
  position: relative;
  width: 50px;

  span {
    font-size: 13px;
    transition: color 0.2s;
    min-width: 0;
    position: relative;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0);
    border: 0 solid black;
    box-sizing: border-box;
    display: inline;
    font: inherit;
    list-style: none;
    margin: 0px;
    padding: 0px;
    position: relative;
    text-align: inherit;
    text-decoration: none;
    white-space: inherit;
    word-wrap: break-word;
  }

  &.liked {
    .icon-container svg {
      color: ${eI};
      fill: ${eI};
    }

    .number-container {
      color: ${eI};
    }

    .icon-container:hover {
      svg {
        color: ${eI};
        fill: ${eI};
      }

      &::before {
        background: ${eO};
      }
    }
  }

  &:hover.like-button .number-container {
    color: ${eI};
  }

  &:hover.comment-button .number-container {
    color: ${eL};
  }

  &.comment-active .number-container {
    color: ${eL};
  }
`,eG=a.Z.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    transition:
      color 0.2s,
      opacity 0.2s;
    position: relative;
    z-index: 1;
    fill: ${eM};
  }

  &.liked-animation svg {
    animation: ${eR} 0.3s ease-in-out;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: transparent;
    transform: translate(-50%, -50%);
    transition: all 0.2s ease;
    z-index: 0;
  }

  &.like-icon:hover {
    svg {
      color: ${eI};
      fill: ${eI};
    }

    &::before {
      width: 36px;
      height: 36px;
      background: ${eO};
    }
  }

  &.comment-icon:hover {
    svg {
      color: ${eL};
      fill: ${eL};
    }

    &::before {
      width: 36px;
      height: 36px;
      background: ${eP};
    }
  }

  &.comment-active {
    svg {
      color: ${eL};
      fill: ${eL};
    }

    &::before {
      width: 36px;
      height: 36px;
      background: ${eP};
    }
  }
`,eU=(0,o.forwardRef)((e,t)=>{let{filled:i=!1}=e;return(0,n.jsx)("svg",{viewBox:"0 0 24 24",ref:t,children:(0,n.jsx)("g",{children:i?(0,n.jsx)("path",{d:"M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"}):(0,n.jsx)("path",{d:"M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"})})})}),eB=()=>(0,n.jsx)("svg",{viewBox:"0 0 24 24",children:(0,n.jsx)("g",{children:(0,n.jsx)("path",{d:"M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"})})}),eY=()=>{let e=360*Math.random(),t=25*Math.random()+25,i=`${Math.cos(Math.PI/180*e)*t}px`,n=[eI,"#ff78c8","#ff4da6","#e60073","#cc0066"],o=Math.random()>.3?"circle":"heart",r=Math.floor(Math.random()*("heart"===o?3:4))+("heart"===o?5:4);return{x:i,y:`${Math.sin(Math.PI/180*e)*t-15}px`,duration:`${.4*Math.random()+.5}s`,delay:`${.15*Math.random()}s`,color:n[Math.floor(Math.random()*n.length)],size:`${r}px`,shape:o,initialScale:.5*Math.random()+.7,initialRotation:`${90*Math.random()-45}deg`}},eJ=e=>{let{id:t,issueId:i,reactions:r,comments:a}=e,{t:s}=(0,l.$G)(),{isAuthenticated:d,token:c,login:h}=en(),[u,m]=(0,o.useState)(r.heartCount),[f,b]=(0,o.useState)(r.userReacted),[v,w]=(0,o.useState)(a.totalCount),[y,j]=(0,o.useState)(!1),[k,$]=(0,o.useState)(!1),[C,z]=(0,o.useState)(!1),[S,Z]=(0,o.useState)([]),E=async()=>{try{console.log("Toggle like for issue:",t,f,c);let e=p(c);if(f)b(!1),m(u-1),await x(e,i,"HEART");else{b(!0),m(u+1),z(!0);let t=Array.from({length:Math.floor(6*Math.random())+10}).map((e,t)=>({id:Date.now()+t,style:eY()}));Z(t),await g(e,i,"HEART")}}catch(e){console.error("Failed to toggle like:",e),b(f),m(u)}};return(0,o.useEffect)(()=>{b(r.userReacted),m(r.heartCount)},[r.userReacted,r.heartCount]),(0,o.useEffect)(()=>{w(a.totalCount)},[a.totalCount]),(0,o.useEffect)(()=>{if(C){let e=setTimeout(()=>{z(!1)},300),t=setTimeout(()=>{Z([])},1200);return()=>{clearTimeout(e),clearTimeout(t)}}},[C]),(0,n.jsxs)(eN,{children:[(0,n.jsxs)(eq,{children:[(0,n.jsxs)(eF,{onClick:()=>{if(!d)return void h();k||($(!0),E(),$(!1))},className:`like-button ${f?"liked":""}`,title:s(d?f?"interaction.liked":"interaction.like":"interaction.loginToLike"),children:[(0,n.jsxs)(eG,{className:`icon-container like-icon ${C?"liked-animation":""}`,children:[(0,n.jsx)(eU,{filled:f}),S.map(e=>(0,n.jsx)(eD,{x:e.style.x,y:e.style.y,duration:e.style.duration,delay:e.style.delay,color:e.style.color,size:e.style.size,shape:e.style.shape,initialScale:e.style.initialScale,initialRotation:e.style.initialRotation},e.id))]}),(0,n.jsx)(eV,{className:"number-container",$isVisible:u>0,children:(0,n.jsx)(et.ZP,{transformTiming:{duration:150,easing:"ease-in-out"},spinTiming:{duration:150,easing:"ease-in-out"},opacityTiming:{duration:150,easing:"ease-in-out"},value:u})})]}),(0,n.jsxs)(eF,{onClick:()=>{if(!d)return void h();j(!y)},className:`comment-button ${y?"comment-active":""}`,title:s(d?"interaction.comment":"interaction.loginToComment"),children:[(0,n.jsx)(eG,{className:`icon-container comment-icon ${y?"comment-active":""}`,children:(0,n.jsx)(eB,{})}),(0,n.jsx)(eV,{className:"number-container",$isVisible:v>0,children:(0,n.jsx)(et.ZP,{transformTiming:{duration:150,easing:"ease-in-out"},spinTiming:{duration:150,easing:"ease-in-out"},opacityTiming:{duration:150,easing:"ease-in-out"},value:v})})]})]}),(0,n.jsx)(e_,{issueNumber:t,issueId:i,isVisible:y,commentCount:v,onCommentCountChange:w})]})},eW=a.Z.div`
  position: relative;
  /* padding: 0.625em 0; */
  margin: 0.625em 0;
  display: flex;
  border-radius: 10px;
`,eK=a.Z.div`
  flex: 1 1;
  padding: 16px 20px 0px;
  margin: 6px;
  overflow: auto;
  background: hsla(0, 0%, 100%, 0.8);
  border: 0.5px solid #f1f1f1;
  border-radius: 10px;
  box-shadow: 0 0.1em 0.2em 0 rgba(234, 234, 234, 0.8);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 15px;
  z-index: 2;

  /* border: 1px solid rgb(212, 212, 216); */
  /* box-shadow:
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.15) 2px 0px 8px 0px; */

  /* &:hover { */
  /* box-shadow: 0 0.2em 0.3em 0.1em rgba(200, 200, 200, 0.4); */
  /* transform: translateY(-1px); */
  /* } */
`,eX=a.Z.div`
  margin-bottom: 0.7em;
  font-size: 1em;
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* gap: 0.2em; */
`,eQ=a.Z.div`
  color: #333;
  &.markdown-body {
    font-size: 1em;
    letter-spacing: 0.2px;
    word-wrap: break-word;
    background-color: transparent;
    /* background: hsla(0, 0%, 100%, 0.8); */
    ol {
      list-style: decimal !important;
    }
    ul {
      list-style: circle !important;
    }
  }
`,e0=a.Z.div`
  position: relative;
  margin-top: 0.8em;
  font-size: 1em;
  user-select: none;
`;var e1=i(2017),e2=i(9928),e5=i(5902);let e4=e=>{let{className:t,size:i=720,springOptions:r={bounce:0}}=e,a=(0,o.useRef)(null),[s,l]=(0,o.useState)(!1),[d,c]=(0,o.useState)(null),p=(0,e1.q)(0,r),h=(0,e1.q)(0,r),u=(0,e2.H)(p,e=>`${e-i/2}px`),m=(0,e2.H)(h,e=>`${e-i/2}px`);(0,o.useEffect)(()=>{if(a.current){let e=a.current.parentElement;e&&("static"===window.getComputedStyle(e).position&&(e.style.position="relative"),e.style.overflow="hidden",c(e))}},[]);let g=(0,o.useCallback)(e=>{if(!d)return;let{left:t,top:i}=d.getBoundingClientRect();p.set(e.clientX-t),h.set(e.clientY-i)},[p,h,d]);(0,o.useEffect)(()=>{if(d)return d.addEventListener("mousemove",g),d.addEventListener("mouseenter",()=>l(!0)),d.addEventListener("mouseleave",()=>l(!1)),()=>{d.removeEventListener("mousemove",g);try{d.removeEventListener("mouseenter",()=>l(!0)),d.removeEventListener("mouseleave",()=>l(!1))}catch(e){console.warn("Could not remove event listeners from parentElement",e)}}},[d,g]);let x={width:i,height:i,left:u.get(),top:m.get(),position:"absolute",pointerEvents:"none",borderRadius:"9999px",backgroundImage:"radial-gradient(circle at center, rgba(255, 255, 255, 0.95), rgba(244, 244, 245, 0.8), rgba(228, 228, 231, 0.4), rgba(200, 200, 200, 0.1), transparent 70%)",filter:"blur(0.5em)",opacity:.9*!!s,transition:"opacity 0.15s ease-in-out"};return(0,n.jsx)(e5.E.div,{ref:a,className:t,style:{...x,left:u,top:m}})},e8=a.Z.span`
  font-weight: 700;
  font-size: 15px;
  color: #132850;
  text-decoration: none;
`,e6=a.Z.span`
  margin-left: 0.2em;
  display: inline-flex;
  align-items: center;
`,e3=a.Z.svg`
  width: 20px;
  height: 20px;
  color: rgb(29, 155, 240);
  fill: rgb(29, 155, 240);
`,e7=a.Z.span`
  margin: 0 4px;
  font-weight: 600;
  color: #a1a1a1;
  text-shadow:
    #d9d9d9 0 0 1px,
    #fffffb 0 0 1px,
    #fffffb 0 0 2px;
  font-size: 0.9em;

  @media (max-width: 479px) {
    margin: auto 0.2em;
  }
`,e9=a.Z.span`
  color: #a1a1a1;
  text-shadow:
    #d9d9d9 0 0 1px,
    #fffffb 0 0 1px,
    #fffffb 0 0 2px;
  font-size: 0.9em;
`,te=a.Z.img`
  width: 2em;
  height: 2em;
  border-radius: 50%;
  margin-right: 0.5em;
  @media (max-width: 479px) {
    width: 1.5em;
    height: 1.5em;
    margin-right: 0.3em;
  }
`,tt=a.Z.a`
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  color: #a1a1a1;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #132850;
  }

  @media (max-width: 479px) {
    margin-left: 4px;
  }
`,ti=a.Z.svg`
  width: 16px;
  height: 16px;
  fill: currentColor;
`,tn=e=>{let t,{issue:i}=e,{i18n:o}=(0,l.$G)();return(0,n.jsxs)(eW,{children:[(0,n.jsx)(e4,{}),(0,n.jsxs)(eK,{children:[(0,n.jsxs)(eX,{children:[(0,n.jsx)(te,{src:d.avatar}),(0,n.jsx)(e8,{children:d.owner}),(0,n.jsx)(e6,{children:(0,n.jsx)(e3,{viewBox:"0 0 22 22",children:(0,n.jsx)("path",{d:"M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"})})}),(0,n.jsx)(e7,{children:"\xb7"}),(0,n.jsx)(e9,{children:_(i.createdAt,o.language)}),(0,n.jsx)(tt,{href:(t=i.number,`https://github.com/${d.owner}/${d.repo}/issues/${t}`),target:"_blank",rel:"noopener noreferrer",title:"在 GitHub 中查看",children:(0,n.jsx)(ti,{viewBox:"0 0 16 16",children:(0,n.jsx)("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"})})}),(0,n.jsx)(R,{name:i.label.name,color:i.label.color,style:{position:"absolute",right:0}})]}),(0,n.jsx)(eQ,{className:"markdown-body",dangerouslySetInnerHTML:{__html:O(i.bodyHTML)}}),(0,n.jsx)(eJ,{id:i.number,issueId:i.id,reactions:i.reactions,comments:{totalCount:i.comments}})]})]})},to=a.Z.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: skeleton-loading 3s infinite;
  border-radius: 4px;
  margin-bottom: 8px;

  @keyframes skeleton-loading {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`,tr=(0,a.Z)(to)`
  width: 2em;
  height: 2em;
  border-radius: 50%;
  margin-right: 0.5em;
  margin-bottom: 0;
  display: inline-flex;
  align-self: center;

  @media (max-width: 479px) {
    width: 1.5em;
    height: 1.5em;
    margin-right: 0.3em;
  }
`,ta=(0,a.Z)(to)`
  width: 120px;
  height: 20px;
  display: inline-flex;
  align-self: center;
  margin-bottom: 0;

  @media (max-width: 479px) {
    width: 90px;
    height: 18px;
  }
`,ts=(0,a.Z)(to)`
  width: 80px;
  height: 16px;
  display: inline-flex;
  align-self: center;
  margin-bottom: 0;
  margin-left: 20px;

  @media (max-width: 479px) {
    width: 60px;
    height: 14px;
    margin-left: 10px;
  }
`,tl=(0,a.Z)(to)`
  width: 60px;
  height: 24px;
  position: absolute;
  right: 0;
  top: 0;

  @media (max-width: 479px) {
    width: 50px;
    height: 20px;
  }
`,td=(0,a.Z)(to)`
  height: 16px;
  margin-top: 12px;
  width: ${e=>e.width};

  @media (max-width: 479px) {
    height: 14px;
    margin-top: 10px;
  }
`,tc=(0,a.Z)(to)`
  width: 100px;
  height: 20px;
  margin-top: 16px;

  @media (max-width: 479px) {
    width: 80px;
    height: 18px;
    margin-top: 12px;
  }
`,tp=()=>(0,n.jsx)(eW,{children:(0,n.jsxs)(eK,{children:[(0,n.jsxs)(eX,{children:[(0,n.jsx)(tr,{}),(0,n.jsx)(ta,{}),(0,n.jsx)(ts,{}),(0,n.jsx)(tl,{})]}),(0,n.jsxs)(eQ,{children:[(0,n.jsx)(td,{width:"95%"}),(0,n.jsx)(td,{width:"85%"}),(0,n.jsx)(td,{width:"75%"}),(0,n.jsx)(td,{width:"65%"})]}),(0,n.jsx)(e0,{children:(0,n.jsx)(tc,{})})]})}),th=a.Z.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,tu=a.Z.button`
  background: ${e=>e.isActive?"#1da1f2":"transparent"};
  color: ${e=>e.isActive?"white":"#657786"};
  border: 1px solid ${e=>e.isActive?"#1da1f2":"#e1e8ed"};
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 32px;

  &:hover {
    background: ${e=>e.isActive?"#1991db":"#f7f9fa"};
    border-color: ${e=>e.isActive?"#1991db":"#d1d9e0"};
  }

  &:active {
    transform: scale(0.95);
  }
`,tm=()=>{let{i18n:e}=(0,l.$G)(),t=t=>{e.changeLanguage(t)};return(0,n.jsxs)(th,{children:[(0,n.jsx)(tu,{isActive:"zh"===e.language||"zh-CN"===e.language,onClick:()=>t("zh"),children:"中"}),(0,n.jsx)(tu,{isActive:"en"===e.language,onClick:()=>t("en"),children:"EN"})]})},tg=a.Z.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: hsla(0, 0%, 100%, 0.8);

  border-radius: 10px;
  border: 1px solid #e1e8ed;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0.1em 0.2em 0 rgba(234, 234, 234, 0.8);
  border: 0.5px solid #f1f1f1;
  margin: 6px;
  margin-bottom: 1em;
`,tx=a.Z.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,tf=a.Z.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,tb=a.Z.button`
  background: #1da1f2;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #1991db;
  }
`,tv=(0,a.Z)(tb)`
  background: transparent;
  color: #657786;
  border: none;
  padding: 0;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.8;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #657786;
    background: transparent;
    opacity: 1;
  }
`,tw=a.Z.div`
  display: flex;
  align-items: center;
  gap: 8px;
  /* background: rgba(255, 255, 255, 0.9); */
  /* padding: 6px 10px; */
  border-radius: 16px;
  /* border: 0.5px solid #e1e8ed; */
  font-size: 14px;
`,ty=a.Z.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`,tj=a.Z.span`
  font-size: 14px;
  font-weight: 500;
  color: #14171a;
`,tk=a.Z.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e1e8ed;
  border-top: 2px solid #1da1f2;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,t$=a.Z.div`
  display: flex;
  align-items: center;
  gap: 8px;
  /* background: rgba(255, 255, 255, 0.9); */
  /* padding: 6px 10px; */
  border-radius: 16px;
  /* border: 0.5px solid #e1e8ed; */
  font-size: 14px;
  color: #657786;
`,tC=()=>{let{t:e}=(0,l.$G)(),{isAuthenticated:t,user:i,login:o,logout:r,isLoading:a}=en();return(0,n.jsxs)(tg,{children:[(0,n.jsx)(tx,{children:(0,n.jsx)(tm,{})}),(0,n.jsx)(tf,{children:a?(0,n.jsxs)(t$,{children:[(0,n.jsx)(tk,{}),(0,n.jsx)("span",{children:e("auth.loading")})]}):t&&i?(0,n.jsxs)(tw,{children:[(0,n.jsx)(ty,{src:i.avatarUrl,alt:i.login}),(0,n.jsxs)(tj,{children:["@",i.login]}),(0,n.jsx)(tv,{onClick:r,children:e("auth.logout")})]}):(0,n.jsxs)(tb,{onClick:o,children:[(0,n.jsx)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor",children:(0,n.jsx)("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"})}),e("auth.login")]})})]})},tz=a.Z.div`
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
`,tS=a.Z.div`
  /* letter-spacing: 1px; */
`,tZ=()=>{let{user:e}=en(),[t,i]=(0,o.useState)([]),[r,a]=(0,o.useState)(!0),[l,c]=(0,o.useState)(!0),[p,m]=(0,o.useState)([]),[g,x]=(0,o.useState)(!1),f=(0,o.useRef)(null),b=(0,o.useRef)(r),v=(0,o.useRef)(null),w=(0,o.useRef)(null==e?void 0:e.login);(0,o.useEffect)(()=>{b.current=r},[r]),(0,o.useEffect)(()=>{w.current=null==e?void 0:e.login},[null==e?void 0:e.login]);let y=(0,o.useCallback)(async()=>{console.log("loadIssues called, isLoading:",b.current);try{let e=(await h.post("/graphql",u({owner:d.owner,repo:d.repo,cursor:f.current,pageSize:d.pageSize}))).data.data.repository.issues,{hasNextPage:t,endCursor:n}=e.pageInfo;c(t),f.current=n,m(t=>[...t,...e.nodes]),i(t=>[...t,...T(e.nodes,w.current)]),a(!1)}catch(e){console.error("err:",e),a(!1)}},[]),j=function(e,t){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=(0,o.useRef)(null);return(0,o.useCallback)(function(){for(var o=arguments.length,r=Array(o),a=0;a<o;a++)r[a]=arguments[a];return n.current||(n.current=E(e,t,i)),n.current(...r)},[e,t,i.leading,i.trailing])}((0,o.useCallback)(()=>{var e;if(b.current||!l)return;let t=window.innerHeight||document.documentElement.clientHeight;window.scrollY+d.offsetTop*t<((null==(e=v.current)?void 0:e.offsetTop)??0)||(console.log("handleLazyLoad triggered, starting new load"),a(!0),y())},[y,l]),200);return(0,o.useEffect)(()=>{g||(console.log("App mounted, initializing data load"),y(),x(!0))},[g,y]),(0,o.useEffect)(()=>{if(g&&l)return window.addEventListener("scroll",j,!1),()=>{window.removeEventListener("scroll",j)}},[g,l,j]),(0,o.useEffect)(()=>{p.length>0&&i(T(p,null==e?void 0:e.login))},[null==e?void 0:e.login,p]),(0,n.jsxs)(tz,{children:[(0,n.jsx)(tC,{}),(0,n.jsx)(D,{}),t.length>0&&(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(tS,{children:(0,n.jsx)(s.Z,{appearAnimation:"accordionVertical",enterAnimation:"accordionVertical",leaveAnimation:"accordionVertical",children:t.map((e,i)=>(0,n.jsx)("div",{ref:i===t.length-1?v:void 0,children:(0,n.jsx)(tn,{issue:e})},`${e.id}-${i}`))})})}),r&&(0,n.jsxs)(tS,{children:[(0,n.jsx)(tp,{}),(0,n.jsx)(tp,{})]}),!l&&(0,n.jsx)(Q,{})]})},tE=a.Z.div`
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
`,tA=a.Z.div`
  padding: 1.25em 0;
  text-align: center;
`,tT=a.Z.p`
  margin: 0.625em auto;
  color: #999;
`,t_=(0,ee.F4)`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
`,tM=(0,ee.F4)`
  0% {
    height: 0%;
  }
  25% {
    height: 0%;
  }
  50% {
    height: 100%;
  }
  75% {
    height: 100%;
  }
  100% {
    height: 0%;
  }
`,tI=a.Z.span`
  display: inline-block;
  width: 2em;
  height: 2em;
  position: relative;
  border: 4px solid #ccc;
  border-radius: 10%;
  box-shadow: inset 0px 0px 20px 20px #ebebeb33;
  animation: ${t_} 2s infinite ease;
`,tL=a.Z.span`
  vertical-align: top;
  display: inline-block;
  width: 100% !important;
  background-color: #ccc;
  box-shadow: 0 0 5px 0px #ccc;
  animation: ${tM} 2s infinite ease-in;
`;var tO=i(7471),tP=i(7716),tR=JSON.parse('{"auth":{"authorizing":"Authorizing...","login":"Login with GitHub","logout":"Logout","loading":"Loading..."},"about":{"title":"Details & Summary","gwitter":{"title":"\uD83C\uDF89 About Gwitter","description":"This is a lightweight microblogging application built on GitHub Issues. Here I record my thoughts on technology, insights into life, and some interesting discoveries. Welcome to join the discussion."},"content":{"title":"✨ About Content","categories":"There are {{count}} categories:"},"subscription":{"title":"\uD83D\uDD0A About Subscription","watch":"Watch","join":"Join","repo":"Gwitter Repository","wechat":"WeChat Group","telegram":"TG Channel"}},"egg":{"message":"Thanks for visiting!","hope":"Hope to see you again","comment":"// TODO: Add more interesting content","runCode":"Run Code"},"interaction":{"like":"Like","liked":"Liked","comment":"Comment","comments":"comments","loginRequired":"Please login first","loginToLike":"Login to like","loginToComment":"Login to comment"},"comments":{"adding":"Commenting...","saving":"Saving...","loading":"Loading comments...","empty":"No comments yet","add":"Comment","edit":"Edit","delete":"Delete","cancel":"Cancel","save":"Save","placeholder":"Write your comment...","confirmDelete":"Are you sure you want to delete this comment?","confirmDeleteTitle":"Delete Comment","confirmDeleteMessage":"Are you sure you want to delete this comment? This action cannot be undone.","deleting":"Deleting...","addSuccess":"Comment added successfully","updateSuccess":"Comment updated successfully","deleteSuccess":"Comment deleted successfully","addFailed":"Failed to add comment","updateFailed":"Failed to update comment","deleteFailed":"Failed to delete comment","more":"More actions","like":"Like","liked":"Liked","likes":"likes"}}'),tH=JSON.parse('{"auth":{"authorizing":"正在授权中...","login":"登录 GitHub","logout":"退出","loading":"加载中..."},"about":{"title":"Details & Summary","gwitter":{"title":"\uD83C\uDF89 关于 Gwitter","description":"这是一个基于 GitHub Issues 构建的轻量级微博应用。这里记录着我对技术的思考、对生活的感悟，以及一些有趣的发现，欢迎一起交流。"},"content":{"title":"✨ 关于内容","categories":"共有{{count}}个分类："},"subscription":{"title":"\uD83D\uDD0A 关于订阅","watch":"Watch","join":"Join","repo":"Gwitter 仓库","wechat":"微信群","telegram":"TG 频道"}},"egg":{"message":"感谢浏览！","hope":"期待再次相见","comment":"// TODO: 添加更多有趣内容","runCode":"运行代码"},"interaction":{"like":"点赞","liked":"已点赞","comment":"评论","comments":"条评论","loginRequired":"请先登录后再进行操作","loginToLike":"登录后点赞","loginToComment":"登录后评论"},"comments":{"adding":"评论中...","saving":"保存中...","loading":"加载评论中...","empty":"暂无评论","add":"评论","edit":"编辑","delete":"删除","cancel":"取消","save":"保存","placeholder":"写下你的评论...","confirmDelete":"确定要删除这条评论吗？","confirmDeleteTitle":"删除评论","confirmDeleteMessage":"确定要删除这条评论吗？删除后将无法恢复。","deleting":"删除中...","addSuccess":"评论添加成功","updateSuccess":"评论更新成功","deleteSuccess":"评论删除成功","addFailed":"评论添加失败","updateFailed":"评论更新失败","deleteFailed":"评论删除失败","more":"更多操作","like":"点赞","liked":"已点赞","likes":"个赞"}}');tO.ZP.use(tP.Z).use(l.Db).init({resources:{en:{translation:tR},zh:{translation:tH}},fallbackLng:"en",interpolation:{escapeValue:!1}});let tD=Z(),tN=()=>(0,n.jsx)(eo,{children:(0,n.jsx)(tZ,{})});tD.code&&(tN=()=>{let{t:e}=(0,l.$G)();return(0,o.useEffect)(()=>{let e=Z().code;e&&w(e).then(e=>{window.opener.postMessage(JSON.stringify({result:e}),window.opener.location)}).catch(e=>{window.opener.postMessage(JSON.stringify({error:e.message}),window.opener.location),console.error(e)})},[]),(0,n.jsx)(tE,{children:(0,n.jsxs)(tA,{children:[(0,n.jsx)(tI,{children:(0,n.jsx)(tL,{})}),(0,n.jsx)(tT,{children:e("auth.authorizing")})]})})}),r.createRoot(document.getElementById("gwitter")).render((0,n.jsx)(n.Fragment,{children:o.createElement(tN)}))},3052:function(){window.Collapse=class{_setPanelHeight(e){let t=e.querySelector("summary + *");t.style.height=`${t.scrollHeight}px`}_removePanelHeight(e){e.querySelector("summary + *").style.height=null}open(e){e.dispatchEvent(this.events.openingPanel),e.open=!0}_afterOpen(e){this._setPanelHeight(e),e.classList.add(this.settings.activeClass)}_endOpen(e){e.dispatchEvent(this.events.openedPanel),this._removePanelHeight(e)}close(e){e.dispatchEvent(this.events.closingPanel),this._afterClose(e)}_afterClose(e){this._setPanelHeight(e),setTimeout(()=>{e.classList.remove(this.settings.activeClass),this._removePanelHeight(e)},100)}_endClose(e){e.dispatchEvent(this.events.closedPanel),e.open=!1}toggle(e){e.open?this.close(e):this.open(e)}openSinglePanel(e){this._panels.forEach(t=>{e!=t||e.open?this.close(t):this.open(t)})}openAll(){this._panels.forEach(e=>{this.open(e)})}closeAll(){this._panels.forEach(e=>{this.close(e)})}_attachEvents(){this._panels.forEach(e=>{let t=e.querySelector("summary"),i=e.querySelector("summary + *");e.addEventListener("toggle",()=>{let t=e.classList.contains(this.settings.heightClass);e.open&&!t&&this._afterOpen(e)}),t.addEventListener("click",t=>{this.settings.accordion?(this.openSinglePanel(e),t.preventDefault()):e.open&&(this.close(e),t.preventDefault())});let n="";i.addEventListener("transitionend",t=>{t.target===i&&(n||(n=t.propertyName),t.propertyName==n&&(e.classList.contains(this.settings.activeClass)?this._endOpen(e):this._endClose(e)))})})}init(){return this._attachEvents(),this._container.classList.add(this.settings.initClass),this}constructor(e,t={}){this.settings=Object.assign({},{accordion:!1,initClass:"collapse-init",activeClass:"panel-active",heightClass:"collapse-reading-height"},t),this._container=e,this._panels=e.querySelectorAll("details"),this.events={openingPanel:new CustomEvent("openingPanel"),openedPanel:new CustomEvent("openedPanel"),closingPanel:new CustomEvent("closingPanel"),closedPanel:new CustomEvent("closedPanel")}}}}},t={};function i(n){var o=t[n];if(void 0!==o)return o.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,i),r.exports}i.m=e,i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;i.t=function(n,o){if(1&o&&(n=this(n)),8&o||"object"==typeof n&&n&&(4&o&&n.__esModule||16&o&&"function"==typeof n.then))return n;var r=Object.create(null);i.r(r);var a={};e=e||[null,t({}),t([]),t(t)];for(var s=2&o&&n;"object"==typeof s&&!~e.indexOf(s);s=t(s))Object.getOwnPropertyNames(s).forEach(e=>{a[e]=()=>n[e]});return a.default=()=>n,i.d(r,a),r}})(),i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e=[];i.O=(t,n,o,r)=>{if(n){r=r||0;for(var a=e.length;a>0&&e[a-1][2]>r;a--)e[a]=e[a-1];e[a]=[n,o,r];return}for(var s=1/0,a=0;a<e.length;a++){for(var[n,o,r]=e[a],l=!0,d=0;d<n.length;d++)(!1&r||s>=r)&&Object.keys(i.O).every(e=>i.O[e](n[d]))?n.splice(d--,1):(l=!1,r<s&&(s=r));if(l){e.splice(a--,1);var c=o();void 0!==c&&(t=c)}}return t}})(),i.rv=()=>"1.3.12",(()=>{var e={980:0};i.O.j=t=>0===e[t];var t=(t,n)=>{var o,r,[a,s,l]=n,d=0;if(a.some(t=>0!==e[t])){for(o in s)i.o(s,o)&&(i.m[o]=s[o]);if(l)var c=l(i)}for(t&&t(n);d<a.length;d++)r=a[d],i.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return i.O(c)},n=self.webpackChunkGwitter=self.webpackChunkGwitter||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),i.ruid="bundler=rspack@1.3.12";var n=i.O(void 0,["72","361","173"],function(){return i(1060)});n=i.O(n)})();