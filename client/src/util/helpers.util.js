const generateRandomName = (nameLength = 10) => {
    let res = '';
    for(let i = 0; i < nameLength; i++){
        const random = Math.floor(Math.random() * 26);
        res += String.fromCharCode('a'.charCodeAt(0) + random);
    };
    return res;
  };

  export { generateRandomName };