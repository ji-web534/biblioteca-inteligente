function Feed() {
    return (
        <section className="library-page">
            <h2 className="library-page__title">Mi Feed</h2>
            <p className="library-page__text">
                Acá verás las novedades de los libros que seguís y la actividad de tu
                comunidad.
            </p>

            <div className="library-page__actions" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
                <div className="library-link library-link--secondary">
                    Próximamente...
                </div>
            </div>
        </section>
    )
}

export default Feed