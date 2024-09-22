import { useState, useEffect } from "react";
import { ethers } from "ethers";
import library_abi from "../artifacts/contracts/LibraryContract.sol/LibraryContract.json"; // Replace with correct path to your ABI

export default function LibraryPage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [libraryContract, setLibraryContract] = useState(undefined);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookId, setBookId] = useState("");
  const [bookAvailability, setBookAvailability] = useState(null);
  const [bookCount, setBookCount] = useState(0);

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your contract's deployed address
  const libraryABI = library_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account is connected.");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("Please connect your MetaMask wallet.");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getLibraryContract();
  };

  const getLibraryContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet, "any");
    const signer = provider.getSigner();
    const library = new ethers.Contract(contractAddress, libraryABI, signer);

    setLibraryContract(library);
  };

  const addBook = async () => {
    if (libraryContract && bookTitle && bookAuthor) {
      try {
        let tx = await libraryContract.addBook(bookTitle, bookAuthor);
        await tx.wait();
        alert("Book added successfully!");
        setBookTitle(""); // Reset title input
        setBookAuthor(""); // Reset author input
        getBookCount();
      } catch (error) {
        console.error("Error adding book:", error);
      }
    }
  };

  const checkAvailability = async () => {
    if (libraryContract && bookId !== "") {
      try {
        const available = await libraryContract.checkAvailability(bookId);
        setBookAvailability(available ? "Available" : "Not Available");
      } catch (error) {
        console.error("Error checking availability:", error);
      }
    }
  };

  const borrowBook = async () => {
    if (libraryContract && bookId !== "") {
      try {
        let tx = await libraryContract.borrowBook(bookId);
        await tx.wait();
        alert("Book borrowed successfully!");
        setBookAvailability("Not Available"); // Update the status
      } catch (error) {
        console.error("Error borrowing book:", error);
      }
    }
  };

  const getBookCount = async () => {
    if (libraryContract) {
      const count = await libraryContract.bookCount();
      setBookCount(parseInt(count));
    }
  };

  useEffect(() => {
    getWallet();
    getBookCount();
  }, []);

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this Library DApp.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>
          Connect MetaMask Wallet
        </button>
      );
    }

    return (
      <div className="library">
        <p>Your Account: {account}</p>
        <h2>Add a New Book</h2>
        <input
          type="text"
          placeholder="Book Title"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={bookAuthor}
          onChange={(e) => setBookAuthor(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>

        <h2>Check Book Availability</h2>
        <input
          type="number"
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />
        <button onClick={checkAvailability}>Check Availability</button>
        {bookAvailability && <p>Availability: {bookAvailability}</p>}

        <h2>Borrow a Book</h2>
        <button onClick={borrowBook}>Borrow Book</button>

        <h3>Total Books in Library: {bookCount}</h3>
      </div>
    );
  };

  return (
    <main className="container">
      <header>
        <h1>Library Management DApp</h1>
      </header>

      {initUser()}

      <style jsx>{`
        .container {
          text-align: center;
          background-color: #f0f0f0;
          padding: 20px;
        }
        .library {
          margin-top: 20px;
        }
        input {
          margin: 10px;
          padding: 10px;
          width: 300px;
        }
        button {
          margin: 10px;
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </main>
  );
}
