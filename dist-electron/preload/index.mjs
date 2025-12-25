"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
function domReady(condition = ["complete", "interactive"]) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}
const safeDOM = {
  append(parent, child) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent, child) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  }
};
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");
  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;
  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    }
  };
}
const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);
window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};
setTimeout(removeLoading, 4999);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi8uLi9lbGVjdHJvbi9wcmVsb2FkL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlwY1JlbmRlcmVyLCBjb250ZXh0QnJpZGdlIH0gZnJvbSAnZWxlY3Ryb24nXG5cbi8vIC0tLS0tLS0tLSBFeHBvc2Ugc29tZSBBUEkgdG8gdGhlIFJlbmRlcmVyIHByb2Nlc3MgLS0tLS0tLS0tXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdpcGNSZW5kZXJlcicsIHtcbiAgb24oLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgaXBjUmVuZGVyZXIub24+KSB7XG4gICAgY29uc3QgW2NoYW5uZWwsIGxpc3RlbmVyXSA9IGFyZ3NcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgKGV2ZW50LCAuLi5hcmdzKSA9PiBsaXN0ZW5lcihldmVudCwgLi4uYXJncykpXG4gIH0sXG4gIG9mZiguLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBpcGNSZW5kZXJlci5vZmY+KSB7XG4gICAgY29uc3QgW2NoYW5uZWwsIC4uLm9taXRdID0gYXJnc1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5vZmYoY2hhbm5lbCwgLi4ub21pdClcbiAgfSxcbiAgc2VuZCguLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBpcGNSZW5kZXJlci5zZW5kPikge1xuICAgIGNvbnN0IFtjaGFubmVsLCAuLi5vbWl0XSA9IGFyZ3NcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCAuLi5vbWl0KVxuICB9LFxuICBpbnZva2UoLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgaXBjUmVuZGVyZXIuaW52b2tlPikge1xuICAgIGNvbnN0IFtjaGFubmVsLCAuLi5vbWl0XSA9IGFyZ3NcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKGNoYW5uZWwsIC4uLm9taXQpXG4gIH0sXG5cbiAgLy8gWW91IGNhbiBleHBvc2Ugb3RoZXIgQVBUcyB5b3UgbmVlZCBoZXJlLlxuICAvLyAuLi5cbn0pXG5cbi8vIC0tLS0tLS0tLSBQcmVsb2FkIHNjcmlwdHMgbG9hZGluZyAtLS0tLS0tLS1cbmZ1bmN0aW9uIGRvbVJlYWR5KGNvbmRpdGlvbjogRG9jdW1lbnRSZWFkeVN0YXRlW10gPSBbJ2NvbXBsZXRlJywgJ2ludGVyYWN0aXZlJ10pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKGNvbmRpdGlvbi5pbmNsdWRlcyhkb2N1bWVudC5yZWFkeVN0YXRlKSkge1xuICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICBpZiAoY29uZGl0aW9uLmluY2x1ZGVzKGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcbn1cblxuY29uc3Qgc2FmZURPTSA9IHtcbiAgYXBwZW5kKHBhcmVudDogSFRNTEVsZW1lbnQsIGNoaWxkOiBIVE1MRWxlbWVudCkge1xuICAgIGlmICghQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmQoZSA9PiBlID09PSBjaGlsZCkpIHtcbiAgICAgIHJldHVybiBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgfVxuICB9LFxuICByZW1vdmUocGFyZW50OiBIVE1MRWxlbWVudCwgY2hpbGQ6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5maW5kKGUgPT4gZSA9PT0gY2hpbGQpKSB7XG4gICAgICByZXR1cm4gcGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkKVxuICAgIH1cbiAgfSxcbn1cblxuLyoqXG4gKiBodHRwczovL3RvYmlhc2FobGluLmNvbS9zcGlua2l0XG4gKiBodHRwczovL2Nvbm5vcmF0aGVydG9uLmNvbS9sb2FkZXJzXG4gKiBodHRwczovL3Byb2plY3RzLmx1a2VoYWFzLm1lL2Nzcy1sb2FkZXJzXG4gKiBodHRwczovL21hdGVqa3VzdGVjLmdpdGh1Yi5pby9TcGluVGhhdFNoaXRcbiAqL1xuZnVuY3Rpb24gdXNlTG9hZGluZygpIHtcbiAgY29uc3QgY2xhc3NOYW1lID0gYGxvYWRlcnMtY3NzX19zcXVhcmUtc3BpbmBcbiAgY29uc3Qgc3R5bGVDb250ZW50ID0gYFxuQGtleWZyYW1lcyBzcXVhcmUtc3BpbiB7XG4gIDI1JSB7IHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMTgwZGVnKSByb3RhdGVZKDApOyB9XG4gIDUwJSB7IHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMTgwZGVnKSByb3RhdGVZKDE4MGRlZyk7IH1cbiAgNzUlIHsgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgwKSByb3RhdGVZKDE4MGRlZyk7IH1cbiAgMTAwJSB7IHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMCkgcm90YXRlWSgwKTsgfVxufVxuLiR7Y2xhc3NOYW1lfSA+IGRpdiB7XG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XG4gIHdpZHRoOiA1MHB4O1xuICBoZWlnaHQ6IDUwcHg7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGFuaW1hdGlvbjogc3F1YXJlLXNwaW4gM3MgMHMgY3ViaWMtYmV6aWVyKDAuMDksIDAuNTcsIDAuNDksIDAuOSkgaW5maW5pdGU7XG59XG4uYXBwLWxvYWRpbmctd3JhcCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogMTAwdmg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBiYWNrZ3JvdW5kOiAjMjgyYzM0O1xuICB6LWluZGV4OiA5O1xufVxuICAgIGBcbiAgY29uc3Qgb1N0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICBjb25zdCBvRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICBvU3R5bGUuaWQgPSAnYXBwLWxvYWRpbmctc3R5bGUnXG4gIG9TdHlsZS5pbm5lckhUTUwgPSBzdHlsZUNvbnRlbnRcbiAgb0Rpdi5jbGFzc05hbWUgPSAnYXBwLWxvYWRpbmctd3JhcCdcbiAgb0Rpdi5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPjxkaXY+PC9kaXY+PC9kaXY+YFxuXG4gIHJldHVybiB7XG4gICAgYXBwZW5kTG9hZGluZygpIHtcbiAgICAgIHNhZmVET00uYXBwZW5kKGRvY3VtZW50LmhlYWQsIG9TdHlsZSlcbiAgICAgIHNhZmVET00uYXBwZW5kKGRvY3VtZW50LmJvZHksIG9EaXYpXG4gICAgfSxcbiAgICByZW1vdmVMb2FkaW5nKCkge1xuICAgICAgc2FmZURPTS5yZW1vdmUoZG9jdW1lbnQuaGVhZCwgb1N0eWxlKVxuICAgICAgc2FmZURPTS5yZW1vdmUoZG9jdW1lbnQuYm9keSwgb0RpdilcbiAgICB9LFxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3QgeyBhcHBlbmRMb2FkaW5nLCByZW1vdmVMb2FkaW5nIH0gPSB1c2VMb2FkaW5nKClcbmRvbVJlYWR5KCkudGhlbihhcHBlbmRMb2FkaW5nKVxuXG53aW5kb3cub25tZXNzYWdlID0gKGV2KSA9PiB7XG4gIGV2LmRhdGEucGF5bG9hZCA9PT0gJ3JlbW92ZUxvYWRpbmcnICYmIHJlbW92ZUxvYWRpbmcoKVxufVxuXG5zZXRUaW1lb3V0KHJlbW92ZUxvYWRpbmcsIDQ5OTkpXG4iXSwibmFtZXMiOlsiY29udGV4dEJyaWRnZSIsImlw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
