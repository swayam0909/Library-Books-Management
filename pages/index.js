import { useState, useEffect } from "react";
import { ethers } from "ethers";
import library_abi from "../artifacts/contracts/LibraryContract.sol/LibraryContract.json";

export default function LibraryPage() {
    const [ethWallet, setEthWallet] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [libraryContract, setLibraryContract] = useState(undefined);
    const [bookTitle, setBookTitle] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [bookAvailability, setBookAvailability] = useState(null);
    const [bookCount, setBookCount] = useState(0);

    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Update with your contract address
    const libraryABI = library_abi.abi;

    const getWallet = async () => {
        if (window.ethereum) {
            setEthWallet(window.ethereum);
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            handleAccount(accounts);
        } else {
            alert("Please install MetaMask to use this Library DApp.");
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
                setBookTitle("");
                setBookAuthor("");
                getBookCount();
            } catch (error) {
                console.error("Error adding book:", error);
                alert("Failed to add book.");
            }
        }
    };

    const checkAvailability = async () => {
        if (libraryContract && bookTitle) {
            try {
                const available = await libraryContract.checkAvailability(bookTitle);
                setBookAvailability(available ? "Available" : "Not Available");
            } catch (error) {
                console.error("Error checking availability:", error);
                alert("Failed to check availability.");
            }
        } else {
            alert("Please enter a valid Book Title.");
        }
    };

    const borrowBook = async () => {
        if (libraryContract && bookTitle) {
            try {
                let tx = await libraryContract.borrowBook(bookTitle);
                await tx.wait();
                alert("Book borrowed successfully!");
                setBookAvailability("Not Available");
            } catch (error) {
                console.error("Error borrowing book:", error);
                alert("Failed to borrow book.");
            }
        } else {
            alert("Please enter a valid Book Title.");
        }
    };

    const returnBook = async () => {
        if (libraryContract && bookTitle) {
            try {
                let tx = await libraryContract.returnBook(bookTitle);
                await tx.wait();
                alert("Book returned successfully!");
                setBookAvailability("Available");
            } catch (error) {
                console.error("Error returning book:", error);
                alert("Failed to return book.");
            }
        } else {
            alert("Please enter a valid Book Title.");
        }
    };

    const getBookCount = async () => {
        if (libraryContract) {
            try {
                const count = await libraryContract.bookCount();
                setBookCount(parseInt(count));
            } catch (error) {
                console.error("Error fetching book count:", error);
                alert("Failed to fetch book count.");
            }
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
                <button onClick={checkAvailability}>Check Availability</button>
                {bookAvailability && <p>Availability: {bookAvailability}</p>}

                <h2>Borrow a Book</h2>
                <button onClick={borrowBook}>Borrow Book</button>

                <h2>Return a Book</h2>
                <button onClick={returnBook}>Return Book</button>

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
                    background-color: #900C3F;
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
