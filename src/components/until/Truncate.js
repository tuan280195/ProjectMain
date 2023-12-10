function Truncate(propString) {
  function truncate(str) {
    console.log(str);
    return str && str.length > 20 ? str.substring(0, 17) + "..." : str;
  }

  return <span>{truncate(propString.str)}</span>;
}

export default Truncate;
