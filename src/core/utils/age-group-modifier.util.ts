export const AgeGroupModifier = (value: string) => {
  if (!value) {
    return null;
  }
  let age = '';
  if (value === 'A10') {
    age = '10대';
  }
  if (value === 'A20') {
    age = '20대';
  }
  if (value === 'A30') {
    age = '30대';
  }
  if (value === 'A40') {
    age = '40대';
  }
  if (value === 'A50') {
    age = '50대';
  }
  if (value === 'A60') {
    age = '60대 이상';
  }

  return age;
};
