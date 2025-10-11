import React from 'react';

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  className = '', 
  fallbackText = null,
  email = null
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [currentImageUrl, setCurrentImageUrl] = React.useState(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
    '2xl': 'w-36 h-36 text-xl'
  };

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate background color based on name
  const getBackgroundColor = (name) => {
    if (!name) return 'bg-gray-400';
    
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = fallbackText || getInitials(name);
  const backgroundColor = getBackgroundColor(name);

  // Simple MD5 hash function for browser
  const md5 = (string) => {
    function md5cycle(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) {
      return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
      return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function md51(s) {
      var n = s.length,
        x = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
      for (var i = 0; i < s.length; i += 16) {
        var olda, oldb, oldc, oldd;
        olda = x[0];
        oldb = x[1];
        oldc = x[2];
        oldd = x[3];
        var j = 0;
        for (; j < 16; j++) {
          x[j] = (s.charCodeAt(i + j) << 24) | (s.charCodeAt(i + j + 1) << 16) | (s.charCodeAt(i + j + 2) << 8) | s.charCodeAt(i + j + 3);
        }
        md5cycle(x, [olda, oldb, oldc, oldd]);
      }
      return x;
    }
    function add32(a, b) {
      return (a + b) & 0xFFFFFFFF;
    }
    function rhex(n) {
      var s = '', j = 0;
      for (; j < 4; j++)
        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
      return s;
    }
    function hex(x) {
      for (var i = 0; i < x.length; i++)
        x[i] = rhex(x[i]);
      return x.join('');
    }
    var hex_chr = '0123456789abcdef'.split('');
    return hex(md51(string));
  };

  // Generate Gravatar image URL if email is provided
  const getGravatarImage = (email) => {
    if (!email) return null;
    // Gravatar API - returns profile image based on email hash
    const hash = md5(email.toLowerCase().trim());
    const sizePx = size === 'sm' ? 64 : size === 'md' ? 128 : size === 'lg' ? 192 : size === 'xl' ? 256 : 400;
    const defaultAvatarUrl = "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80";
    return `https://www.gravatar.com/avatar/${hash}?s=${sizePx}&d=${encodeURIComponent(defaultAvatarUrl)}`;
  };

  // Use provided src if available, otherwise use default avatar
  const defaultAvatarUrl = "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80";
  const imageUrl = src || defaultAvatarUrl;

  // Update current image URL when props change
  React.useEffect(() => {
    setCurrentImageUrl(imageUrl);
    setImageError(false);
  }, [imageUrl]);

  // If image fails to load, show avatar with initials
  if (imageError) {
    return (
      <div 
        className={`
          ${sizeClasses[size]} 
          ${backgroundColor} 
          rounded-full 
          flex 
          items-center 
          justify-center 
          text-white 
          font-semibold 
          ${className}
        `}
        title={name || alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={currentImageUrl || imageUrl}
      alt={alt || name || 'Avatar'}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={() => {
        // Only show initials if the default avatar also fails
        if (currentImageUrl === defaultAvatarUrl) {
          setImageError(true);
        } else {
          // Try default avatar if current image fails
          setCurrentImageUrl(defaultAvatarUrl);
        }
      }}
      title={name || alt}
    />
  );
};

export default Avatar;
