export function formatDateTime(isoString:string) {
  const date = new Date(isoString);
  const formattedDate = date.toISOString().slice(0, 10)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = (hours % 12) || 12
  const formattedTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`
  return `${formattedDate} ${formattedTime}`
}

export function formatDate(dateString:string | number | Date | undefined) {
  if (!dateString) {
    return
  }
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.toLocaleString('en-US', { month: 'short' }) 
  const day = date.getDate().toString().padStart(2, '0')         

  return `${year} ${month} ${day}`;
}
