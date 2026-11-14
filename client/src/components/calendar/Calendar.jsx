import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { academicEvents, monthNames, selectedDay, weekdayLabels } from '../../data/calendar'

const GRID_CELLS = 42 // 6 semanas x 7 dias

const isSameDay = (target, year, month, day) =>
  target.year === year && target.month === month && target.day === day

export function Calendar({ month, year, onMonthChange }) {
  const firstWeekday = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const previousMonthDays = new Date(year, month, 0).getDate()
  const nextEvent = academicEvents[0]

  const cells = Array.from({ length: GRID_CELLS }, (_, index) => {
    const day = index - firstWeekday + 1

    if (day < 1 || day > totalDays) {
      const outsideDay = day < 1 ? previousMonthDays + day : day - totalDays
      return (
        <button className="muted" type="button" key={index}>
          {outsideDay}
        </button>
      )
    }

    const weekday = new Date(year, month, day).getDay()
    const classes = [
      weekday > 0 && weekday < 6 && 'school-day',
      academicEvents.some((event) => isSameDay(event, year, month, day)) && 'event-day',
      isSameDay(selectedDay, year, month, day) && 'selected',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button className={classes} type="button" key={index}>
        {day}
      </button>
    )
  })

  return (
    <section className="calendar-card" id="calendar-section">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Agenda acadêmica</p>
          <h2>Calendário</h2>
        </div>
        <button className="icon-button subtle" type="button" aria-label="Abrir calendário">
          <ArrowUpRight size={16} />
        </button>
      </div>
      <div className="calendar-nav">
        <button type="button" onClick={() => onMonthChange(-1)} aria-label="Mês anterior">
          <ChevronLeft size={15} />
        </button>
        <strong>
          {monthNames[month]} {year}
        </strong>
        <button type="button" onClick={() => onMonthChange(1)} aria-label="Próximo mês">
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="weekdays">
        {weekdayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="calendar-days">{cells}</div>
      <div className="calendar-legend">
        <span>
          <i className="legend-dot green-dot" />
          Dia letivo
        </span>
        <span>
          <i className="legend-dot amber-dot" />
          Evento
        </span>
      </div>
      {nextEvent && (
        <div className="next-event">
          <span className="event-date">
            {nextEvent.day}
            <span>{monthNames[nextEvent.month].slice(0, 3).toUpperCase()}</span>
          </span>
          <div>
            <strong>{nextEvent.title}</strong>
            <small>{nextEvent.detail}</small>
          </div>
          <ChevronRight className="event-arrow" size={16} />
        </div>
      )}
    </section>
  )
}
