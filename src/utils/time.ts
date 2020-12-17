export const makeTwoDigits = (digit: number): string => ('0' + digit).slice(-2)

export function getTimeText(
  date: Date
): {
  fullText: string // 전체 시간
  ISOString: string // datetime 속성에 들어갈 ISO 문자열
} {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDay()
  const hours = makeTwoDigits(date.getHours())
  const minutes = makeTwoDigits(date.getMinutes())
  const seconds = makeTwoDigits(date.getSeconds())
  const fullText = `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`
  const ISOString = date.toISOString()

  return {
    fullText,
    ISOString,
  }
}
