export function isVietnamesePhoneNumber(phone = "") {
  const _phone = convertToInternationalFormat(phone) || "";
  return /^(84\d{9}|842\d{10})$/g.test(_phone);
}

export function convertToInternationalFormat(phone?: string) {
  if (!phone) {
    return phone || "";
  }
  let cleanedPhone = phone?.replace(/\D/g, "");
  if (cleanedPhone.startsWith("0")) {
    cleanedPhone = cleanedPhone.slice(1);
    return `84${cleanedPhone}`;
  }
  return cleanedPhone;
}

export function formatPhoneNumber(phone = "") {
  let _phone = phone.replace(/\D/g, "");
  if (_phone.startsWith("84")) {
    if (_phone.length === 11 || _phone.length === 12) {
      _phone = _phone.replace("84", "0");
    }
  }

  // 0901-234-567
  if (_phone.length > 4 && /^0[3-9]/g.test(_phone)) {
    if (_phone.length < 8) {
      return _phone.replace(/(\d{4})(\d*)/, "$1-$2");
    }
    return _phone.replace(/(\d{4})(\d{3})(\d{1,3})(\d*)/, "$1-$2-$3");
  }

  // 028-1234-5678
  if (_phone.length > 3 && /^02[4,8].*/g.test(_phone)) {
    if (_phone.length < 8) {
      return _phone.replace(/(\d{3})(\d*)/, "$1-$2");
    }
    return _phone.replace(/(\d{3})(\d{4})(\d{1,4})(\d*)/, "$1-$2-$3");
  }

  if (_phone.length > 3 && /^02.*/g.test(_phone)) {
    if (_phone.length < 9) {
      return _phone.replace(/(\d{4})(\d*)/, "$1-$2");
    }
    return _phone.replace(/(\d{4})(\d{4})(\d{1,4})(\d*)/, "$1-$2-$3");
  }

  return phone;
}
