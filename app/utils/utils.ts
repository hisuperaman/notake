export function toDatetimeLocalString(date: Date) {
    const pad = (n: Number) => n.toString().padStart(2, '0');
  
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

export function insertBeforeLastClosingTag(html: String, insertHTML: String) {
  return html.replace(/(<\/[a-z]+>)\s*$/, `${insertHTML}$1`);
}

export function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}