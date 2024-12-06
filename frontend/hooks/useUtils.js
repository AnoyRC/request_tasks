export default function useUtils() {
  const formatAddress = (address) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return {
    formatAddress,
  };
}
