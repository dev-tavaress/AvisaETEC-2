import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { monthNames } from '../../data/calendar'

export function Calendar({ month, year, onMonthChange }) {
  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDay + 1
    if (day < 1 || day > totalDays) return <button className="muted" key={index}>{day < 1 ? new Date(year, month, 0).getDate() + day : day - totalDays}</button>
    const date = new Date(year, month, day)
    return <button key={index} className={`${date.getDay() > 0 && date.getDay() < 6 ? 'school-day' : ''} ${day === 18 && month === 5 ? 'event-day' : ''} ${day === 17 && month === 5 ? 'selected' : ''}`}>{day}</button>
  })
  return <section className="calendar-card" id="calendar-section"><div className="card-heading"><div><p className="eyebrow">Agenda acadêmica</p><h2>Calendário</h2></div><button className="icon-button subtle" aria-label="Abrir calendário"><ArrowUpRight size={16} /></button></div><div className="calendar-nav"><button onClick={() => onMonthChange(-1)} aria-label="Mês anterior"><ChevronLeft size={15} /></button><strong>{monthNames[month]} {year}</strong><button onClick={() => onMonthChange(1)} aria-label="Próximo mês"><ChevronRight size={15} /></button></div><div className="weekdays"><span>DOM</span><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span></div><div className="calendar-days">{days}</div><div className="calendar-legend"><span><i className="legend-dot green-dot" />Dia letivo</span><span><i className="legend-dot amber-dot" />Evento</span></div><div className="next-event"><span className="event-date">18<span>JUN</span></span><div><strong>Entrega do TCC</strong><small>Quarta-feira · Até 23:59</small></div><ChevronRight className="event-arrow" size={16} /></div></section>
}
