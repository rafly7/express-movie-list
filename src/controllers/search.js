const mostViewedMovie = async (req, res, service) => {
  try {
    const mostViewedMovie = await service.mostViewedMovie()
    res.status(200).json(mostViewedMovie)
  } catch (e) {
    res.status(500).send('Something went wrong')
  }
}

const mostViewedGenre = async (req, res, service) => {
  try {
    const mostViewedGenre = await service.mostViewedGenre()
    res.status(200).json(mostViewedGenre)
  } catch (e) {
    res.status(500).send('Something went wrong')
  }
}
export {mostViewedGenre, mostViewedMovie}