import { RootDataProvider } from "./RootDataContext";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { RoleProvider } from "./RoleContext";
import { CartProvider } from "./CartContext";
import { PartProvider } from "./PartContext";
import { ServiceProvider } from "./ServiceContext";
import { OrderProvider } from "./OrderContext";
import { MaintenanceProvider } from "./MaintenanceContext";
import { CategoryProvider } from "./CategoryContext";
import { SupplierProvider } from "./SupplierContext";
import { PartPriceProvider } from "./PartPriceContext";
import { StockProvider } from "./StockContext";
import { PaymentMethodProvider } from "./PaymentMethodContext";
import { PaymentProvider } from "./PaymentContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => (
  <RootDataProvider>
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <CategoryProvider>
            <SupplierProvider>
              <ServiceProvider>
                <PartProvider>
                  <PartPriceProvider>
                    <StockProvider>
                      <PaymentMethodProvider>
                        <CartProvider>
                          <OrderProvider>
                            <PaymentProvider>
                              <MaintenanceProvider>
                                {children}
                              </MaintenanceProvider>
                            </PaymentProvider>
                          </OrderProvider>
                        </CartProvider>
                      </PaymentMethodProvider>
                    </StockProvider>
                  </PartPriceProvider>
                </PartProvider>
              </ServiceProvider>
            </SupplierProvider>
          </CategoryProvider>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  </RootDataProvider>
);

export default Providers;