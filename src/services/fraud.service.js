const detectSuspiciousListing = (listingInput) => {
  const redFlags = [];

  if (listingInput.price && Number(listingInput.price) <= 0) {
    redFlags.push('Non-positive price');
  }

  const riskyKeywords = ['urgent payment', 'wire transfer', 'crypto only', 'pay now'];
  const content = `${listingInput.title || ''} ${listingInput.description || ''}`.toLowerCase();

  riskyKeywords.forEach((keyword) => {
    if (content.includes(keyword)) {
      redFlags.push(`Keyword detected: ${keyword}`);
    }
  });

  return {
    suspicious: redFlags.length > 0,
    score: Math.min(redFlags.length * 25, 100),
    reasons: redFlags
  };
};

module.exports = { detectSuspiciousListing };
