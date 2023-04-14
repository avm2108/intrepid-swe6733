/*-- styles for match page--*/

export const styles = {
  body: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  card: {
    height: '667px',
    width: '360px',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  container: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontSize: '36px',
    fontWeight: 'bold',
  },
  h2: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  p: {
    fontSize: '18px',
  },
  name: {
    marginTop: '0px',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#d10000',
  },
  text: {
    marginTop: '0px',
    marginBottom: '0px',
    fontSize: '18px',
    fontWeight: 'bolder',
    color: '#131313',
  },
  interestsText: {
    marginTop: '0px',
    fontSize: '18px',
    fontWeight: 'bolder',
    color: '#131313',
  },

  button: {
    backgroundColor: '#d10000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    outline: 'none',
    marginTop: '20px',
    fontSize: '24px',
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    zIndex: 1,
  },
  modalBackground :{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
};

/*-- styles for prospect cards--*/

export const modalStyles = {
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    height: '325px',
    width: '100%',
  },
  column: {
    width: '150px',
    height: '250px',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'start',
    fontSize: '14px',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '5px',
  },
  card: {
    backgroundColor: '#fff',
    height: '100%',
    textAlign: 'start',
    borderRadius: '5px',
    padding: '10px',
    paddingTop: '0px',
  },
  cardBody: {
    textAlign: 'start',
  },
  name: {
    marginTop: '0px',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#d10000',
  },
  text: {
    marginTop: '0px',
    marginBottom: '0px',
    fontSize: '14px',
    fontWeight: 'bolder',
    color: '#131313',
  },
  interestsText: {
    marginTop: '0px',
    fontSize: '14px',
    fontWeight: 'bolder',
    color: '#131313',
  },
  recommendText: {
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bolder',
    color: '#d10000',
  },
  recommendContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingBottom: '55px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingBottom: '20px',
  },
  buttonPrev: {
    backgroundColor: '#5A5A5A',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    outline: 'none',
  },
  buttonNext: {
    backgroundColor: '#d10000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    outline: 'none',
  },

};
