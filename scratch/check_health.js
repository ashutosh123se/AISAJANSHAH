const check = async () => {
  try {
    const res = await fetch('https://ai01.sajanshah.com/api/health');
    const text = await res.text();
    console.log('STATUS:', res.status, 'BODY:', text);
  } catch (e) {
    console.log('ERROR:', e.message);
  }
};
check();
