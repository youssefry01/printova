// ================= CONFIG =================
const BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://printova.onrender.com";

function getToken() {
    return localStorage.getItem("token");
}

function setResult(elementId, data) {
    document.getElementById(elementId).textContent = JSON.stringify(data, null, 2);
}

async function apiRequest(endpoint, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    const token = getToken();
    if (token) {
        options.headers["Authorization"] = "Bearer " + token;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(BASE_URL + endpoint, options);

    try {
        return await response.json();
    } catch (error) {
        return { message: "No JSON response" };
    }
}

//================= SESSION =================
async function updateCurrentUser() {
    const token = getToken();
    const banner = document.getElementById("welcomeBanner");
    const emailSpan = document.getElementById("currentUserEmail");

    if (!token) {
        banner.style.display = "none";
        emailSpan.textContent = "";
        return;
    }

    const userId = localStorage.getItem("currentUserId");
    if (!userId) return;

    const result = await apiRequest(`/api/user/${userId}`);
    if (result?.firstName) {
        emailSpan.textContent = `${result.firstName} ${result.lastName}`;
        banner.style.display = "block";
    }
}
//================= AUTH =================
async function register() {
    const data = {
        firstName: regFirstName.value,
        lastName: regLastName.value,
        phone: regPhone.value,
        password: regPassword.value,
        email: regEmail.value,
        address: regAddress.value
    };

    const result = await apiRequest("/api/auth/register", "POST", data);
    alert(JSON.stringify(result));
}

async function login() {
    const data = {
        email: loginEmail.value,
        password: loginPassword.value
    };

    const result = await apiRequest("/api/auth/login", "POST", data);

    if (result.accessToken) {
        tokenBox.value = result.accessToken;
        localStorage.setItem("token", result.accessToken);
        if (result.userDTO?.id) {
            localStorage.setItem("currentUserId", result.userDTO.id);
        }
        updateCurrentUser();
    } else {
        alert("Login failed");
    }
}

async function logout() {
    await apiRequest("/api/auth/logout", "POST");
    localStorage.clear();
    tokenBox.value = "";
    logoutMessage.textContent = "Logged out successfully!";
    updateCurrentUser();
}

async function changePassword() {
    const result = await apiRequest("/api/auth/change-password", "POST", {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
    });

    setResult("changePasswordResult", result);
}
// ================= USERS =================
async function getUser() {
    setResult("userResult",
        await apiRequest(`/api/user/${getUserId.value}`));
}

async function getAllUsers() {
    setResult("allUsersResult",
        await apiRequest("/api/user"));
}

async function updateUser() {
    setResult("updateResult",
        await apiRequest(`/api/user/${updateUserId.value}`, "PUT", {
            firstName: updateFirstName.value,
            lastName: updateLastName.value,
            phone: updatePhone.value,
            email: updateEmail.value,
            address: updateAddress.value
        }));
}

// ================= ROLES =================
async function getAllRoles() {
    setResult("allRolesResult", await apiRequest("/api/roles"));
}

async function getRoleById() {
    setResult("roleByIdResult", await apiRequest(`/api/roles/${roleById.value}`));
}

async function addRole() {
    setResult("addRoleResult",
        await apiRequest("/api/roles", "POST", { roleName: addRoleName.value }));
}

async function getUserRoles() {
    setResult("userRoles",
        await apiRequest(`/api/roles/user/${getUserRolesRoleId.value}`));
}

async function addUserRole() {
    setResult("addUserRoleResult",
        await apiRequest(`/api/roles/user/${addUserRoleUserId.value}`,
            "POST", { roleName: addUserRoleName.value }));
}

async function removeUserRole() {
    setResult("removeUserRoleResult",
        await apiRequest(`/api/roles/user/${removeUserRoleUserId.value}`,
            "DELETE", { roleName: removeUserRoleName.value }));
}

// ================= CATEGORY =================
async function getAllCategories() {
    setResult("allCategoriesResult",
        await apiRequest("/api/category"));
}

async function getCategory() {
    setResult("categoryResult", await apiRequest(`/api/category/${getCategoryId.value}`));
}

async function addCategory() {
    setResult("addCategoryResult",
        await apiRequest("/api/category", "POST", {
            categoryName: addCategoryName.value,
            categoryDescription: addCategoryDescription.value
        }));
}

async function updateCategory() {
    setResult("updateCategoryResult",
        await apiRequest(`/api/category/${updateCategoryId.value}`,
            "PUT", {
                categoryName: updateCategoryName.value,
                categoryDescription: updateCategoryDescription.value
            }));
}

async function deleteCategory() {
    setResult("deleteCategoryResult",
        await apiRequest(`/api/category/${deleteCategoryId.value}`, "DELETE"));
}

// ================= SUPPLIER =================
async function getAllSuppliers() {
    setResult("allSuppliersResult",
        await apiRequest("/api/supplier"));
}

async function getSupplier() {
    setResult("supplierResult", await apiRequest(`/api/supplier/${getSupplierId.value}`));
}

async function addSupplier() {
    setResult("addSupplierResult",
        await apiRequest("/api/supplier", "POST", {
            supplierName: addSupplierName.value,
            supplierEmail: addSupplierEmail.value,
            supplierPhone: addSupplierPhone.value
        }));
}

async function updateSupplier() {
    setResult("updateSupplierResult",
        await apiRequest(`/api/supplier/${updateSupplierId.value}`,
            "PUT", {
                supplierName: updateSupplierName.value,
                supplierEmail: updateSupplierEmail.value,
                supplierPhone: updateSupplierPhone.value
            }));
}

async function deleteSupplier() {
    setResult("deleteSupplierResult",
        await apiRequest(`/api/supplier/${deleteSupplierId.value}`, "DELETE"));
}

// ================= SERVICES =================
async function getAllServices() {
    setResult("allServicesResult",
        await apiRequest("/api/service"));
}

async function getService() {
    setResult("serviceResult", await apiRequest(`/api/service/${getServiceId.value}`));
}

async function addService() {
    setResult("addServiceResult",
        await apiRequest("/api/service", "POST", {
            serviceName: addServiceName.value,
            servicePrice: addServicePrice.value
        }));
}

async function updateService() {
    setResult("updateServiceResult",
        await apiRequest(`/api/service/${updateServiceId.value}`,
            "PUT", {
                serviceName: updateServiceName.value,
                servicePrice: updateServicePrice.value
            }));
}

async function deleteService() {
    setResult("deleteServiceResult",
        await apiRequest(`/api/service/${deleteServiceId.value}`, "DELETE"));
}

// ================= PARTS =================
async function getAllParts() {
    setResult("allPartsResult",
        await apiRequest("/api/part"));
}

async function getPart() {
    setResult("partResult", await apiRequest(`/api/part/${getPartId.value}`));
}

async function addPart() {
    setResult("addPartResult",
        await apiRequest("/api/part", "POST", {
            partName: addPartName.value,
            partDescription: addPartDescription.value,
            categoryId: addPartCategoryId.value,
            supplierId: addPartSupplierId.value,
            initialPrice: addPartInitialPrice.value
        }));
}

async function updatePart() {
    setResult("updatePartResult",
        await apiRequest(`/api/part/${updatePartId.value}`,
            "PUT", {
                partName: updatePartName.value,
                partDescription: updatePartDescription.value,
                categoryId: updatePartCategoryId.value,
                supplierId: updatePartSupplierId.value
            }));
}

async function deletePart() {
    setResult("deletePartResult",
        await apiRequest(`/api/part/${deletePartId.value}`, "DELETE"));
}

// ================= PART PRICE =================
async function getAllPrices() {
    setResult("allPricesResult",
        await apiRequest("/api/part-price"));
}

async function getPartPrices() {
    setResult("partPricesResult", await apiRequest(`/api/part-price/part/${getPartPricesId.value}`));
}

async function getLatestPartPrice() {
    setResult("latestPartPriceResult",
        await apiRequest(`/api/part-price/part/${getLatestPartPriceId.value}/latest`));
}

async function addPartPrice() {
    setResult("addPartPriceResult",
        await apiRequest("/api/part-price", "POST", {
            partId: addPartPricePartId.value,
            price: addPartPriceValue.value
        }));
}

// ================= STOCK =================
async function getAllStock() {
    setResult("allStockResult", await apiRequest("/api/stock"));
}

async function getPartStock() {
    setResult("partStockResult", await apiRequest(`/api/stock/part/${getStockPartId.value}`));
}

async function updatePartStock() {
    setResult("updatePartStockResult", await apiRequest(`/api/stock/${updatePartStockPartId.value}`, "PUT", {
        stockQuantity: updatePartStockValue.value
    }));
}
async function adjustPartStock() {
    setResult("adjustPartStockResult", await apiRequest(`/api/stock/${adjustPartStockPartId.value}/adjust`, "POST", {
        partId: adjustPartStockPartId.value,
        quantityChange: adjustPartStockQuantityChange.value
    }));
}

// ================= PAYMENT METHOD =================
async function getAllPaymentMethods() {
    setResult("allPaymentMethodsResult", await apiRequest("/api/payment-method"));
}

async function getPaymentMethod() {
    setResult("paymentMethodResult", await apiRequest(`/api/payment-method/${getPaymentMethodId.value}`));
}

async function updatePaymentMethod() {
    setResult("updatePaymentMethodResult", await apiRequest(`/api/payment-method/${updatePaymentMethodId.value}`, "PUT", {
        paymentMethodCode: updatePaymentMethodCode.value,
        paymentMethodName: updatePaymentMethodName.value
    }));
}

async function addPaymentMethod() {
    setResult("addPaymentMethodResult", await apiRequest("/api/payment-method", "POST", {
        paymentMethodCode: addPaymentMethodCode.value,
        paymentMethodName: addPaymentMethodName.value
    }));
}

async function deletePaymentMethod() {
    setResult("deletePaymentMethodResult", await apiRequest(`/api/payment-method/${deletePaymentMethodId.value}`, "DELETE"));
}

// ================= CART =================
async function getCart() {
    setResult("cartResult", await apiRequest("/api/cart"));
}

async function addToCart() {
    setResult("addToCartResult",
        await apiRequest("/api/cart", "POST", {
            partId: addToCartPartId.value,
            quantity: addToCartQuantity.value
        }));
}

async function updateCartItemQuantity() {
    setResult("updateCartItemQuantityResult", await apiRequest(`/api/cart/item/${updateCartItemPartId.value}`, "PUT", {
        quantity: updateCartItemQuantityValue.value
    }));
}

async function removeCartItem() {
    setResult("removeCartItemResult",
        await apiRequest(`/api/cart/item/${removeCartItemPartId.value}`, "DELETE"));
}

async function clearCart() {
    setResult("clearCartResult",
        await apiRequest(`/api/cart/clear`, "DELETE"));
}

// ================= ORDERS =================
async function getOrders() {
    setResult("ordersResult", await apiRequest("/api/order"));
}

async function getOrder() {
    setResult("orderByIdResult", await apiRequest(`/api/order/${getOrderById.value}`));
}

async function createOrder() {
    setResult("createOrderResult",
        await apiRequest("/api/order", "POST", {
            address: createOrderAddress.value
        }));
}

// ================= DELIVERY =================
async function getPendingOrders() {
    setResult("pendingOrdersResult", await apiRequest("/api/order/delivery?status=PENDING"));
}

async function getCompletedOrders() {
    setResult("completedOrdersResult", await apiRequest("/api/order/delivery?status=COMPLETED"));
}

async function completeOrder() {
    setResult("completeOrderResult",
        await apiRequest(`/api/order/delivery/complete/${completeOrderId.value}`, "PATCH"));
}

// ================= MAINTENANCE =================
async function getMaintenances() {
    setResult("maintenancesResult", await apiRequest("/api/maintenance"));
}

async function getMaintenance() {
    setResult("maintenanceByIdResult", await apiRequest(`/api/maintenance/${getMaintenanceById.value}`));
}

async function createMaintenance() {
    setResult("createMaintenanceResult",
        await apiRequest("/api/maintenance", "POST", {
            address: createMaintenanceAddress.value,
            description: createMaintenanceDescription.value,
            date: createMaintenanceDate.value
        }));
}

// ================= TECHNICIAN =================
async function getScheduledMaintenances() {
    setResult("scheduledMaintenancesResult", await apiRequest("/api/maintenance/technician?status=SCHEDULED"));
}

async function getCompletedMaintenances() {
    setResult("completedMaintenancesResult", await apiRequest("/api/maintenance/technician?status=COMPLETED"));
}

async function completeMaintenance() {
    setResult("completeMaintenanceResult",
        await apiRequest(`/api/maintenance/technician/complete/${completeMaintenanceId.value}`, "PATCH"));
}


// ================= PAYMENTS =================
async function getAllPayments() {
    setResult("allPaymentsResult", await apiRequest("/api/payment"));
}

async function getPaymentById() {
    setResult("paymentByIdResult", await apiRequest(`/api/payment/${paymentById.value}`));
}

window.onload = function () {
    updateCurrentUser();
};

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        const header = section.querySelector("h2");

        header.addEventListener("click", () => {
            section.classList.toggle("collapsed");
        });
    });
});