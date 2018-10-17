const sleep = delay => new Promise(resolve => setTimeout(resolve), delay);

function convertMillisToMinsSecs(millis) {
  const mins = Math.floor(millis / 60000);
  const secs = ((millis % 60000) / 1000).toFixed(0);
  const duration = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  return duration;
}

export { sleep, convertMillisToMinsSecs };
