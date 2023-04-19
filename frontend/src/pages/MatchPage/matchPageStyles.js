/*-- styles for match page--*/

export const styles = {
  
  card: {
    height: '667px',
    width: '360px',
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    top: '50%',
    left: '50%',
  },
  container: {
    textAlign: 'center'
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
    backgroundColor: '#20A090',
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: '16px',
    lineHeight: '16px',
    fontWeight: 700,
    borderRadius: '16px',
    height: '48px',
    width: '20.438em',
    cursor: 'pointer',
    border: 0,
    outline: 0,
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
    width: '400px',
    border: '1px',
    borderStyle: 'solid',
    borderColor: 'rgb(121, 123, 124, .2)'
  },
  modalBackground :{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'white',
  }
};

/*-- styles for prospect cards--*/

export const modalStyles = {
  h4: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '18px',
  },
  container: {
    backgroundColor: '#fff',
    display: 'block',
    /* display: 'flex',
    justifyContent: 'center',
    alignItems: 'start', */
    height: '325px',
    width: '100%',
  },
  column: {
    width: '100%',
    // height: '250px',
    display: 'block',
    position: 'relative',
    /* display: 'flex',
    justifyContent: 'start',
    alignItems: 'start', */
    fontSize: '14px',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '5px',
  },
  prospectInfo: {
    position: 'absolute',
    zIndex: '1',
    bottom: '20px',
    textAlign: 'left',
    paddingLeft: '16px',
  },
  name: {
    marginTop: '0px',
    marginBottom: '5px',
    fontWeight: '500',
    fontSize: '30px',
    color: 'white',
  },
  text: {
    marginTop: '0px',
    marginBottom: '0px',
    fontSize: '14px',
    fontWeight: 'bolder',
    color: 'white',
  },
  interestsText: {
    marginTop: '0px',
    fontSize: '14px',
    fontWeight: 'bolder',
    color: 'white',
    backgroundColor: '#20A090',
    border: 'none',
    borderRadius:' 12px',
    padding:' 12px',
  },
  recommendText: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bolder',
    color: '#d10000',
  },
  recommendContainer: {
    width: '100%',
    paddingTop: '25px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // position: 'absolute',
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
    width: '50%',
    fontSize: '16px'
  },
  buttonNext: {
    backgroundColor: '#20A090',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    width: '50%',
    outline: 'none',
    fontSize: '16px'
  },

};
